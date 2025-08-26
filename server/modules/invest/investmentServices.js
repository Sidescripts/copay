const { Investment, User, Sequelize } = require('../../model');
// const {Op} = Sequelize;
const { Op } = require('sequelize');
const logger = require('../../utils/logger');


function ROIService() {
  return {
    processCompletedInvestments: async function() {
      const result = { processed: 0, failed: 0, errors: [] };
      
      try {
        const now = new Date();
        logger.debug(`🔍 Looking for investments ending before: ${now.toISOString()}`);

        // Find investments that have ended but not been paid out
        const completedInvestments = await Investment.findAll({
          where: {
            status: 'active',
            end_date: { [Op.lte]: now },
            payout_date: null
          },
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'walletBalance', 'username']
          }]
        });

        logger.debug(`📊 Found ${completedInvestments.length} investments to process`);

        // Process each investment
        for (const investment of completedInvestments) {
          try {
            const roiAmount = investment.expected_roi;
            const newBalance = investment.user.walletBalance + roiAmount;

            // Update user's wallet balance
            await User.update(
              { walletBalance: newBalance },
              { where: { id: investment.user.id } }
            );

            // Update investment status
            await investment.update({
              status: 'completed',
              actual_roi: roiAmount,
              payout_date: now
            });

            result.processed++;
            
            logger.info(`💸 Paid ROI of ${roiAmount} to user ${investment.user.username} (${investment.user.id})`);

          } catch (error) {
            result.failed++;
            result.errors.push({
              investment_id: investment.id,
              user_id: investment.user.id,
              error: error.message
            });
            
            logger.error(`❌ Failed to process investment ${investment.id}:`, error);
          }
        }

        return result;

      } catch (error) {
        logger.error('❌ ROI processing error:', error);
        result.errors.push({ error: error.message });
        return result;
      }
    },
    
    
  };
}

module.exports = { 
  ROIService: ROIService(),
  processCompletedInvestments: ROIService().processCompletedInvestments
};
  