const { Investment, InvestmentPlan, User } = require('../../model');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const EmailTemplate = require("./investEmail");
// const { where } = require('sequelize');

function InvestmentController() {
  return {
    
    
    createInvestment: async function(req, res) {
      try {
        // Input validation (express-validator)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ 
            success: false,
            errors: errors.array() 
          });
        }
    
        const { paymentMethod, amount, name, id } = req.body;
        const userId = req.user.id;
    
        // Validate required fields early
        if (!amount || !paymentMethod || !name || !id) {
          return res.status(400).json({
            success: false,
            error: 'All fields are required: paymentMethod, amount, name, id'
          });
        }
    
        // Validate amount is positive
        if (amount <= 0) {
          return res.status(400).json({
            success: false,
            error: 'Amount must be a positive value'
          });
        }
    
        // Find and validate plan
        const plan = await InvestmentPlan.findOne({ where: { id } });
        if (!plan) {
          return res.status(404).json({ 
            success: false, 
            error: 'Investment plan not found' 
          });
        }
    
        if (!plan.is_active) {
          return res.status(400).json({ 
            success: false, 
            error: 'Investment plan is currently inactive' 
          });
        }
    
        // Validate amount range
        if (amount < plan.min_amount) {
          return res.status(400).json({ 
            success: false,
            error: `Minimum investment amount is ${plan.min_amount}` 
          });
        }
    
        if (amount > plan.max_amount) {
          return res.status(400).json({ 
            success: false,
            error: `Maximum investment amount is ${plan.max_amount}` 
          });
        }
    
        // Find user and check balance
        const user = await User.findByPk(userId, {
          attributes: ['id', 'walletBalance', 'totalRevenue', 'email', 'btcBal', 'ethBal', 'usdtBal'],
        });
    
        if (!user) {
          return res.status(404).json({ 
            success: false, 
            error: 'User not found' 
          });
        }
    
        if (user.walletBalance < amount) {
          return res.status(400).json({ 
            success: false, 
            error: 'Insufficient wallet balance' 
          });
        }
    
        // ────────────────────────────────────────────────
        // Validate payment method BEFORE creating investment
        // We keep the switch structure as requested
        let updateFields = {
          walletBalance: user.walletBalance - amount,
          totalRevenue: user.totalRevenue + amount
        };
    
        switch (paymentMethod.toLowerCase()) {
          case 'bitcoin':
            // updateFields.btcBal = user.btcBal - amount;   // uncomment if you want to deduct from specific balance
            break;
          case 'ethereum':
            // updateFields.ethBal = user.ethBal - amount;
            break;
          case 'usdt':
            // updateFields.usdtBal = user.usdtBal - amount;
            break;
          default:
            return res.status(400).json({ 
              success: false, 
              error: 'Invalid payment method. Use: bitcoin, ethereum, or usdt' 
            });
        }
        // ────────────────────────────────────────────────
    
        // Now safe to create the investment record
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.duration_days);
    
        const expectedROI = amount * plan.roi_percentage;
    
        const investment = await Investment.create({
          amount,
          expected_roi: expectedROI,
          status: 'active',
          start_date: startDate,
          end_date: endDate,
          transaction_id: `rev_${uuidv4()}`,
          userId,
          planName: plan.name,
          InvestmentPlanId: id
        });
    
        // Deduct balance and update revenue
        await User.update(updateFields, { where: { id: userId } });
    
        // Send confirmation email (non-blocking)
        try {
          await EmailTemplate.investmentEmail({
            email: user.email,
            planName: plan.name,
            amount: investment.amount,
            duration: plan.duration_days,
            endDate: endDate,
            investmentId: investment.transaction_id,
            status: investment.status
          });
        } catch (emailError) {
          console.error("Failed to send investment email:", emailError);
        }
    
        return res.status(201).json({
          success: true,
          message: 'Investment created successfully',
          data: investment
        });
    
      } catch (error) {
        console.error('Create investment error:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to create investment' 
        });
      }
    },

    // Get user investments
    getUserInvestments: async function(req, res) {
      try {
        const userId = req.user.id;

        const investments = await Investment.findAll({
          where: { userId },
          include: [{
            model: InvestmentPlan,
            as: 'investmentPlan',
            attributes: ['name', 'roi_percentage', 'duration_days']
          }],
          order: [['createdAt', 'DESC']]
        });

        // return res.json({ investments });
        return res.status(200).json({success: true, investments});

      } catch (error) {
        console.error('Get investments error:', error);
        return res.status(500).json({ error: 'Failed to fetch investments' });
      }
    },

    // Add this method to your existing controller
getSingleInvestment: async function(req, res) {
  try {
      const { id } = req.params;
      const userId = req.user.id;

      // Find the investment that belongs to this user
      const investment = await Investment.findOne({
          where: { 
              id: id,
              userId: userId 
          },
          
          include: [{
              model: InvestmentPlan,
              as: 'investmentPlan'
          }]
      });

      if (!investment) {
          return res.status(404).json({ error: 'Investment not found' });
      }

      res.json({ 
          success: true, 
          investment 
      });

  } catch (error) {
      console.error('Error fetching investment:', error);
      res.status(500).json({ error: 'Server error' });
  }
}
  };
}

module.exports = InvestmentController;