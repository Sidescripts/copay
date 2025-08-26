const { Investment, InvestmentPlan, User } = require('../../model');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const EmailTemplate = require("./investEmail");

function InvestmentController() {
  return {
    
    // User: Invest in a plan
    createInvestment: async function(req, res) {
      // Start transaction early for data consistency
      const transaction = await sequelize.transaction();
      
      try {
          // Input validation
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
              await transaction.rollback();
              return res.status(400).json({ 
                  success: false,
                  errors: errors.array() 
              });
          }
  
          const { plan_id, amount } = req.body;
          const userId = req.user.id;
  
          // Validate required fields
          if (!plan_id || !amount) {
              await transaction.rollback();
              return res.status(400).json({
                  success: false,
                  error: 'Plan ID and amount are required'
              });
          }
  
          // Validate amount is a positive number
          if (amount <= 0) {
              await transaction.rollback();
              return res.status(400).json({
                  success: false,
                  error: 'Amount must be a positive value'
              });
          }
  
          // Get the investment plan with transaction lock to prevent race conditions
          const plan = await InvestmentPlan.findByPk(plan_id, {
              lock: transaction.LOCK.UPDATE,
              transaction
          });
          
          if (!plan) {
              await transaction.rollback();
              return res.status(404).json({ 
                  success: false,
                  error: 'Investment plan not found' 
              });
          }
          
          if (!plan.is_active) {
              await transaction.rollback();
              return res.status(400).json({ 
                  success: false,
                  error: 'Investment plan is inactive' 
              });
          }
  
          // Validate amount range
          if (amount < plan.min_amount) {
              await transaction.rollback();
              return res.status(400).json({ 
                  success: false,
                  error: `Amount must be at least ${plan.min_amount}` 
              });
          }
          
          if (amount > plan.max_amount) {
              await transaction.rollback();
              return res.status(400).json({ 
                  success: false,
                  error: `Amount cannot exceed ${plan.max_amount}` 
              });
          }
  
          // Check user balance with transaction lock
          const user = await User.findByPk(userId, {
              attributes: ['id', 'walletBalance', 'totalRevenue', 'email'],
              lock: transaction.LOCK.UPDATE,
              transaction
          });
          
          if (!user) {
              await transaction.rollback();
              return res.status(404).json({ 
                  success: false,
                  error: 'User not found' 
              });
          }
  
          if (user.walletBalance < amount) {
              await transaction.rollback();
              return res.status(400).json({ 
                  success: false,
                  error: 'Insufficient balance' 
              });
          }
  
          // Calculate expected ROI
          const expectedROI = (amount * plan.roi_percentage) / 100;
  
          // Create investment record
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + plan.duration_days);
  
          const investment = await Investment.create({
              amount,
              expected_roi: expectedROI,
              status: 'active',
              start_date: startDate,
              end_date: endDate,
              transaction_id: `inv_${uuidv4()}`,
              userId,
              InvestmentPlanId: plan_id
          }, { transaction });
  
          // Update user wallet balance and total revenue
          await User.update({
              walletBalance: user.walletBalance - amount,
              totalRevenue: (user.totalRevenue || 0) + amount
          }, {
              where: { id: userId },
              transaction
          });
  
          // Send investment confirmation email
          try {
              await EmailTemplate.investmentEmail({
                  email: user.email,
                  planName: plan.name,
                  amount: investment.amount,
                  duration: plan.duration_days,
                  expectedROI: expectedROI,
                  endDate: endDate,
                  investmentId: investment.transaction_id,
                  status: investment.status
              });
          } catch (emailError) {
              // Log email error but don't fail the transaction
              console.error("Failed to send investment email:", emailError);
          }
  
          // Commit transaction
          await transaction.commit();
          
          return res.status(201).json({
              success: true,
              message: 'Investment created successfully',
              data: investment
          });
  
      } catch (error) {
          // Always rollback on error
          await transaction.rollback();
          
          // Log the error for debugging
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
            as: 'plan',
            attributes: ['name', 'roi_percentage', 'duration_days']
          }],
          order: [['createdAt', 'DESC']]
        });

        return res.json({ investments });

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
              as: 'plan'
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