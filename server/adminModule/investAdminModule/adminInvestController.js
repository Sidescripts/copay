const { Investment, InvestmentPlan, User, sequelize } = require('../../model');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

function AdminInvestmentController() {
  return {

    // Admin: Create investment plan
    createPlan: async function(req, res) {
      // const transaction = await sequelize.transaction();
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          // await transaction.rollback();
          return res.status(400).json({ 
            success: false,
            errors: errors.array() 
          });
        }
        console.log(req.body)
        const { 
          name, 
          description, 
          min_amount, 
          max_amount, 
          duration_days, 
          roi_percentage 
        } = req.body;

        // Validate amount ranges
        if (min_amount <= 0 || max_amount <= 0) {
          // await transaction.rollback();
          return res.status(400).json({ 
            success: false,
            error: 'Amounts must be positive values' 
          });
        }

        if (min_amount > max_amount) {
          // await transaction.rollback();
          return res.status(400).json({ 
            success: false,
            error: 'Minimum amount cannot be greater than maximum amount' 
          });
        }

        const plan = await InvestmentPlan.create({
          name,
          description,
          min_amount,
          max_amount,
          duration_days,
          roi_percentage,
          is_active: true
        });

        console.log(plan)
        return res.status(201).json({
          success: true,
          message: 'Investment plan created successfully',
          data: plan
        });

      } catch (error) {
        // await transaction.rollback();
        console.error('Create plan error:', error);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to create investment plan' 
        });
      }
    },

    // Get all investment plans (for frontend - active only)
    getInvestmentPlans: async function(req, res) {
      try {
        const plans = await InvestmentPlan.findAll({
          where: { is_active: true },
          order: [['min_amount', 'ASC']]
        });
        console.log(plans)
        return res.json({ 
          success: true,
          data: plans 
        });

      } catch (error) {
        console.error('Get plans error:', error);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to fetch investment plans' 
        });
      }
    },

    // Admin: Get all plans (including inactive)
    findAllPlan: async function(req, res) {
      try {
        const plans = await InvestmentPlan.findAll({
          order: [['createdAt', 'DESC']]
        });

        return res.json({ 
          success: true,
          data:plans
        });

      } catch (error) {
        console.error('Get all plans error:', error);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to fetch investment plans' 
        });
      }
    },

    // Admin: Update investment plan
    updatePlan: async function(req, res) {
      
      try {

        const { planId } = req.params;
        
        const updates = req.body;

        const plan = await InvestmentPlan.findByPk(planId);
        
        if (!plan) {
          // await transaction.rollback();
          return res.status(404).json({ 
            success: false,
            error: 'Investment plan not found' 
          });
        }

        
          if (updates.min_amount > updates.max_amount) {
            
            return res.status(400).json({ 
              success: false,
              error: 'Minimum amount cannot be greater than maximum amount' 
            });
          }
        
        await plan.update(updates);
        
        return res.json({
          success: true,
          message: 'Investment plan updated successfully',
          data: plan
        });

      } catch (error) {
        // await transaction.rollback();
        console.error('Update plan error:', error);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to update investment plan' 
        });
      }
    },

    // Admin: Deactivate investment plan (set is_active to false)
    deactivatePlan: async function(req, res) {
      // const transaction = await sequelize.transaction();
      try {
        const { planId } = req.params;

        const plan = await InvestmentPlan.findByPk(planId);
        if (!plan) {
          
          return res.status(404).json({ 
            success: false,
            error: 'Investment plan not found' 
          });
        }

        if (!plan.is_active) {
          // await transaction.rollback();
          return res.status(400).json({ 
            success: false,
            error: 'Investment plan is already deactivated' 
          });
        }

        // Check if plan has active investments
        const activeInvestments = await Investment.count({
          where: { 
            InvestmentPlanId: planId,
            status: 'active'
          },
          
        });

        if (activeInvestments > 0) {
          
          return res.status(400).json({ 
            success: false,
            error: 'Cannot deactivate plan with active investments' 
          });
        }

        await plan.update({ is_active: false });
        
        return res.json({
          success: true,
          message: 'Investment plan deactivated successfully',
          data: plan
        });

      } catch (error) {
        
        console.error('Deactivate plan error:', error);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to deactivate investment plan' 
        });
      }
    },

    // Admin: Delete investment plan
    deletePlan: async function(req, res) {
      
      try {
        const { planId } = req.params;

        const plan = await InvestmentPlan.findByPk(planId);
        if (!plan) {
          // await transaction.rollback();
          return res.status(404).json({ 
            success: false,
            error: 'Investment plan not found' 
          });
        }

        // Check if plan has any investments (active or completed)
        const investmentsCount = await Investment.count({
          where: { InvestmentPlanId: planId }
        });

        if (investmentsCount > 0) {
          // await transaction.rollback();
          return res.status(400).json({ 
            success: false,
            error: 'Cannot delete plan with existing investments' 
          });
        }

        await plan.destroy();
        
        return res.json({
          success: true,
          message: 'Investment plan deleted successfully'
        });

      } catch (error) {
        // await transaction.rollback();
        console.error('Delete plan error:', error);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to delete investment plan' 
        });
      }
    },

    // Admin: Get all investments (with filters)
    getAllInvestments: async function(req, res) {
      try {
        const { status, userId, page = 1, limit = 20 } = req.query;

        const whereClause = {};
        if (status) whereClause.status = status;
        if (userId) whereClause.userId = userId;

        const investments = await Investment.findAndCountAll({
          where: whereClause,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email']
            },
            {
              model: InvestmentPlan,
              as: 'plan',
              attributes: ['name', 'roi_percentage']
            }
          ],
          order: [['createdAt', 'DESC']],
          limit: parseInt(limit),
          offset: (parseInt(page) - 1) * parseInt(limit)
        });

        return res.json({
          success: true,
          data: {
            investments: investments.rows,
            total: investments.count,
            totalPages: Math.ceil(investments.count / limit),
            currentPage: parseInt(page)
          }
        });

      } catch (error) {
        console.error('Get all investments error:', error);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to fetch investments' 
        });
      }
    },

    // Admin: Manual ROI payout for specific investment
    manualROIPayout: async function(req, res) {
      // const transaction = await sequelize.transaction();
      try {
        const { investment_id } = req.params;

        const investment = await Investment.findByPk(investment_id, {
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'walletBalance']
          }],
          transaction
        });

        if (!investment) {
          // await transaction.rollback();
          return res.status(404).json({ 
            success: false,
            error: 'Investment not found' 
          });
        }

        if (investment.status !== 'active') {
          // await transaction.rollback();
          return res.status(400).json({ 
            success: false,
            error: 'Only active investments can be paid out' 
          });
        }

        // Calculate ROI amount
        const roiAmount = investment.expected_roi;

        // Update user's wallet balance
        await User.update(
          { walletBalance: Investment.sequelize.literal(`"walletBalance" + ${roiAmount}`) },
          { where: { id: investment.user.id } }
        );

        // Update investment status
        await investment.update({
          status: 'completed',
          actual_roi: roiAmount,
          end_date: new Date(),
          payout_date: new Date()
        });

        // await transaction.commit();

        return res.json({
          success: true,
          message: `ROI of ${roiAmount} paid out successfully`,
          data: investment
        });

      } catch (error) {
        // await transaction.rollback();
        console.error('Manual ROI payout error:', error);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to process manual ROI payout' 
        });
      }
    },

  };
}

// Helper function for ROI processing (used by both cron and manual)
async function processCompletedInvestments() {
  const now = new Date();
  const result = { processed: 0, failed: 0, errors: [] };

  const transaction = await sequelize.transaction();
  
  try {
    const completedInvestments = await Investment.findAll({
      where: {
        status: 'active',
        end_date: { [Op.lte]: now },
        payout_date: null
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'walletBalance']
      }],
      transaction
    });

    for (const investment of completedInvestments) {
      try {
        const roiAmount = investment.expected_roi;

        await User.update(
          { walletBalance: sequelize.literal(`"walletBalance" + ${roiAmount}`) },
          { where: { id: investment.user.id }, transaction }
        );

        await investment.update({
          status: 'completed',
          actual_roi: roiAmount,
          payout_date: now
        }, { transaction });

        result.processed++;
        
      } catch (error) {
        result.failed++;
        result.errors.push({
          investment_id: investment.id,
          error: error.message
        });
        console.error(`Failed to process investment ${investment.id}:`, error);
      }
    }

    await transaction.commit();
    return result;

  } catch (error) {
    await transaction.rollback();
    console.error('ROI processing error:', error);
    throw error;
  }
}

module.exports = AdminInvestmentController();