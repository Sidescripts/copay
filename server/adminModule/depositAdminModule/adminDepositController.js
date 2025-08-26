const { validationResult } = require('express-validator');
const { Deposit, User } = require('../../model');
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
  const transaction = await sequelize.transaction();
  
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          await transaction.rollback();
          return res.status(400).json({
              success: false,
              message: 'Validation failed',
              errors: errors.array()
          });
      }

      const { depositId, amount, asset } = req.body;

      // Validate required fields
      if (!depositId || !amount || !asset) {
          await transaction.rollback();
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
          }],
          transaction
      });

      if (!deposit) {
          await transaction.rollback();
          return res.status(404).json({
              success: false,
              message: 'Deposit request not found'
          });
      }

      // Verify the amount and asset match the deposit request
      if (parseFloat(amount) !== parseFloat(deposit.amount)) {
          await transaction.rollback();
          return res.status(400).json({
              success: false,
              message: `Amount does not match deposit request. Expected: ${deposit.amount}`
          });
      }

      if (asset.toUpperCase() !== deposit.asset.toUpperCase()) {
          await transaction.rollback();
          return res.status(400).json({
              success: false,
              message: `Asset does not match deposit request. Expected: ${deposit.asset}`
          });
      }

      // Check if deposit is already processed
      if (deposit.status === 'completed') {
          await transaction.rollback();
          return res.status(400).json({
              success: false,
              message: 'Deposit has already been processed'
          });
      }

      // Normalize asset for case-insensitive comparison
      const normalizedAsset = asset.toUpperCase();
      
      // Define update object based on asset type
      let updateFields = {};
      
      switch (normalizedAsset) {
          case 'BTC':
              updateFields = {
                  walletBalance: sequelize.literal(`"walletBalance" + ${amount}`),
                  btcBal: sequelize.literal(`"btcBal" + ${amount}`)
              };
              break;
          case 'ETH':
              updateFields = {
                  walletBalance: sequelize.literal(`"walletBalance" + ${amount}`),
                  ethBal: sequelize.literal(`"ethBal" + ${amount}`)
              };
              break;
          case 'USDT':
              updateFields = {
                  walletBalance: sequelize.literal(`"walletBalance" + ${amount}`),
                  usdtBal: sequelize.literal(`"usdtBal" + ${amount}`)
              };
              break;
          case 'LTC':
              updateFields = {
                  walletBalance: sequelize.literal(`"walletBalance" + ${amount}`),
                  ltcBal: sequelize.literal(`"ltcBal" + ${amount}`)
              };
              break;
          case 'BCH':
              updateFields = {
                  walletBalance: sequelize.literal(`"walletBalance" + ${amount}`),
                  bchBal: sequelize.literal(`"bchBal" + ${amount}`)
              };
              break;
          case 'BNB':
              updateFields = {
                  walletBalance: sequelize.literal(`"walletBalance" + ${amount}`),
                  bnbBal: sequelize.literal(`"bnbBal" + ${amount}`)
              };
              break;
          case 'DOGE':
              updateFields = {
                  walletBalance: sequelize.literal(`"walletBalance" + ${amount}`),
                  dogeBal: sequelize.literal(`"dogeBal" + ${amount}`)
              };
              break;
          case 'DASH':
              updateFields = {
                  walletBalance: sequelize.literal(`"walletBalance" + ${amount}`),
                  dashBal: sequelize.literal(`"dashBal" + ${amount}`)
              };
              break;
          default:
              await transaction.rollback();
              return res.status(400).json({
                  success: false,
                  message: "Not a valid asset"
              });
      }

      // Update user's balances
      await User.update(updateFields, {
          where: { id: deposit.userId },
          transaction
      });

      // Update deposit status to completed
      await deposit.update({
          status: 'completed',
          completed_at: new Date(),
          processed_by: req.user.id // Track which admin processed this
      }, { transaction });

      // Send notification email to user
      try {
          await EmailTemplate.depositApprovalEmail({
              email: deposit.user.email,
              amount: deposit.amount,
              asset: deposit.asset,
              transactionId: deposit.transaction_id
          });
      } catch (emailError) {
          console.error("Failed to send deposit processed email:", emailError);
          // Don't fail the transaction if email fails
      }

      await transaction.commit();

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
      await transaction.rollback();
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