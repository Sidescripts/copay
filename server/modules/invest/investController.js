const { Investment, InvestmentPlan, User } = require('../../model');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const EmailTemplate = require("./investEmail");
// const { where } = require('sequelize');

function InvestmentController() {
  return {
    
    // User: Invest in a plan
    createInvestment: async function(req, res) {
      
      
      try {
          // Input validation
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
              
              return res.status(400).json({ 
                  success: false,
                  errors: errors.array() 
              });
          }
  
          const { paymentMethod, amount,  name, id} = req.body;
        
          const userId = req.user.id;
          console.log(req.body)
          const plan = await InvestmentPlan.findOne({ where: { id} })
          
        
        if(!plan){
            return res.status(404).json({success: false, error: 'No invesment plan now'})
            
        }
          
          // Validate required fields
          if (!amount || !paymentMethod || !name || !id) {
              
              return res.status(400).json({
                  success: false,
                  error: 'All values are required'
              });
          }
  
          // Validate amount is a positive number
          if (amount <= 0) {
              
              return res.status(400).json({
                  success: false,
                  error: 'Amount must be a positive value'
              });
          }
  
          
          
          
          if (!plan) {
              
              return res.status(404).json({ 
                  success: false,
                  error: 'Investment plan not found' 
              });
          }
          
          if (!plan.is_active) {
              
              return res.status(400).json({ 
                  success: false,
                  error: 'Investment plan is inactive' 
              });
          }
  
          // Validate amount range
          if (amount < plan.min_amount) {
              
              return res.status(400).json({ 
                  success: false,
                  error: `Amount must be at least ${plan.min_amount}` 
              });
          }
          
          if (amount > plan.max_amount) {
              
              return res.status(400).json({ 
                  success: false,
                  error: `Amount cannot exceed ${plan.max_amount}` 
              });
          }
  
          // Check user balance with transaction lock
          const user = await User.findByPk(userId, {
              attributes: [
                'id', 
                'walletBalance', 
                'totalRevenue', 
                'email',
                'btcBal',
                'ethBal',
                'usdtBal'
            ],
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
                  error: 'Insufficient balance' 
              });
          }
  
          // Calculate expected ROI
          const expectedROI = (amount * plan.roi_percentage);
  
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
              transaction_id: `rev_${uuidv4()}`,
              userId,
              planName: plan.name,
              InvestmentPlanId: id
          });
  
          // Update user wallet balance and total revenue
          if (paymentMethod === 'bitcoin'){
            await User.update({
                btcBal: user.btcBal - amount,    
                walletBalance: user.walletBalance - amount,
                totalRevenue: (user.totalRevenue) + amount
            }, {where: { id: userId }});
          }else if(paymentMethod === 'ethereum'){
            await User.update({
                btcBal: user.ethBal - amount,    
                walletBalance: user.walletBalance - amount,
                totalRevenue: (user.totalRevenue) + amount
              }, {where: { id: userId }});
          }else if(paymentMethod === 'usdt'){
            await User.update({
                btcBal: user.usdtBal - amount,    
                walletBalance: user.walletBalance - amount,
                totalRevenue: (user.totalRevenue) + amount
              }, {where: { id: userId }});
          }

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
  
          
          return res.status(201).json({
              success: true,
              message: 'Investment created successfully',
              data: investment
          });
  
      } catch (error) {
          
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