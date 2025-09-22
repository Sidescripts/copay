const { validationResult } = require('express-validator');
const { Deposit, User, sequelize } = require('../../model');
const EmailTemplate = require("./depositApprovalEmail");

const adminDepositController = {
  // Get all deposits (admin)
  getAllDeposits: async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { status, userId } = req.query;

        const whereClause = {};
        if (status) whereClause.status = status;
        if (userId) whereClause.userId = userId;

        const deposits = await Deposit.findAll({
            where: whereClause,
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'email', 'username']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                deposits: deposits,
                total: deposits.length,
            }
        });
    } catch (error) {
        console.error('Get all deposits error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
},


  // Admin: Credit user account (process deposit)
adminProcessDeposit: async (req, res) => {
//   const transaction = await sequelize.transaction();
  
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          
          return res.status(400).json({
              success: false,
              message: 'Validation failed',
              errors: errors.array()
          });
      }
    //   console.log(req.body)
      const { depositId, amount, asset } = req.body;

      // Validate required fields
      if (!depositId || !amount || !asset) {
          
          return res.status(400).json({
              success: false,
              message: 'Deposit ID, amount, and asset are required'
          });
      }

      // Find the deposit request
      const deposit = await Deposit.findByPk(depositId, {
          include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'email']
          }]
        });

      if (!deposit) {
          
          return res.status(404).json({
              success: false,
              message: 'Deposit request not found'
          });
      }

      // Verify the amount and asset match the deposit request
      if (parseFloat(amount) !== parseFloat(deposit.amount)) {
          
          return res.status(400).json({
              success: false,
              message: `Amount does not match deposit request. Expected: ${deposit.amount}`
          });
      }

      if (asset.toUpperCase() !== deposit.asset.toUpperCase()) {
          
          return res.status(400).json({
              success: false,
              message: `Asset does not match deposit request. Expected: ${deposit.asset}`
          });
      }

      // Check if deposit is already processed
      if (deposit.status === 'completed') {
          
          return res.status(400).json({
              success: false,
              message: 'Deposit has already been processed'
          });
      }

      // Normalize asset for case-insensitive comparison
      const normalizedAsset = asset.toUpperCase();
      
      // Find the user first
const user = await User.findByPk(deposit.userId);

if (!user) {
    return res.status(404).json({
        success: false,
        message: "User not found"
    });
}

// Define increment fields based on asset type
let incrementFields = {
    walletBalance: amount
};

switch (normalizedAsset) {
    case 'BTC':
        incrementFields.btcBal = amount;
        break;
    case 'ETH':
        incrementFields.ethBal = amount;
        break;
    case 'USDT':
        incrementFields.usdtBal = amount;
        break;
    case 'LTC':
        incrementFields.ltcBal = amount;
        break;
    case 'BCH':
        incrementFields.bchBal = amount;
        break;
    case 'BNB':
        incrementFields.bnbBal = amount;
        break;
    case 'DOGE':
        incrementFields.dogeBal = amount;
        break;
    case 'DASH':
        incrementFields.dashBal = amount;
        break;
    default:
        return res.status(400).json({
            success: false,
            message: "Not a valid asset"
        });
}

// Increment the balances
await user.increment(incrementFields);

// const {adminId} = req.admin.id;
// Update deposit status to completed
await deposit.update({
    status: 'completed',
    completed_at: new Date(),
    // processed_by: adminId // Track which admin processed this
});

      // Send notification email to user
      try {
          await EmailTemplate.depositApprovalEmail({
              email: deposit.user.email,
              amount: deposit.amount,
              asset: deposit.asset,
              transactionId: deposit.transaction_id,
              approvalDate: deposit.completed_at
          });
      } catch (emailError) {
          console.error("Failed to send deposit processed email:", emailError);
          // Don't fail the transaction if email fails
      }

      

      res.json({
          success: true,
          message: 'Deposit processed successfully',
          data: {
              deposit: deposit,
              creditedAmount: amount,
              creditedAsset: asset
          }
      });

  } catch (error) {
      
      console.error('Admin process deposit error:', error);
      res.status(500).json({
          success: false,
          message: 'Failed to process deposit'
      });
  }
},

  // Get deposit statistics (admin)
  getDepositStats: async (req, res) => {
    try {
      const totalDeposits = await Deposit.count();
      const pendingDeposits = await Deposit.count({ where: { status: 'pending' } });
      const completedDeposits = await Deposit.count({ where: { status: 'completed' } });
      const totalAmount = await Deposit.sum('amount', { where: { status: 'completed' } });

      res.json({
        success: true,
        data: {
          totalDeposits,
          pendingDeposits,
          completedDeposits,
          totalAmount: totalAmount || 0
        }
      });
    } catch (error) {
      console.error('Get deposit stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = adminDepositController;