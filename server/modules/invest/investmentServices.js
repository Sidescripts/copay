const { Investment, User } = require('../../model');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');

function ROIService() {
  return {
    processCompletedInvestments: async function() {
      const result = { processed: 0, failed: 0, errors: [] };
      
      try {
        const now = new Date();
        logger.debug(`🔍 Looking for active investments for daily ROI accrual as of: ${now.toISOString()}`);

        // Find active investments that are ongoing or ending
        const activeInvestments = await Investment.findAll({
          where: {
            status: 'active',
            start_date: { [Op.lte]: now }, // Started
            end_date: { [Op.gte]: now }    // Not yet ended (for accrual during period)
          },
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'walletBalance', 'revenue', 'username']
          }]
        });

        logger.debug(`📊 Found ${activeInvestments.length} active investments to check for daily accrual`);

        // One day in milliseconds
        const ONE_DAY_MS = 1000 * 60 * 60 * 24;

        // Process each investment
        for (const investment of activeInvestments) {
          try {
            const startDate = new Date(investment.start_date);
            const endDate = new Date(investment.end_date);

            // Validate dates
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              throw new Error(`Invalid start_date or end_date for investment ${investment.id}`);
            }

            const durationDays = Math.ceil((endDate - startDate) / ONE_DAY_MS);
            const dailyRoi = parseFloat(investment.expected_roi) / durationDays;
            const currentBalanceNum = parseFloat(investment.user.walletBalance) || 0;
            const currentRevenueNum = parseFloat(investment.user.revenue) || 0;

            // Determine last payout date (repurposing payout_date as last_daily_payout_date; null means start_date)
            let lastPayoutDate = investment.payout_date ? new Date(investment.payout_date) : new Date(startDate);
            if (isNaN(lastPayoutDate.getTime())) {
              lastPayoutDate = new Date(startDate);
            }

            const todayStart = new Date(now);
            todayStart.setHours(0, 0, 0, 0); // Start of today

            // Check if a new day has started since last payout
            if (todayStart > lastPayoutDate) {
              // Calculate days elapsed since start (for logging/validation)
              const startDay = new Date(startDate);
              startDay.setHours(0, 0, 0, 0);
              const daysElapsed = Math.floor((todayStart - startDay) / ONE_DAY_MS) + 1;

              // Create a new Date object for endDate to avoid modifying the original
              const endDateStartOfDay = new Date(endDate);
              endDateStartOfDay.setHours(0, 0, 0, 0);
              
              // Check if today is the last day or beyond
              let isLastDay = (todayStart.getTime() >= endDateStartOfDay.getTime());

              let amountToAdd;
              if (isLastDay) {
                // On last day, ensure full remaining is paid
                const totalDue = parseFloat(investment.expected_roi);
                const alreadyPaid = dailyRoi * (daysElapsed - 1); // Approximate, but since we pay daily, should be exact
                amountToAdd = totalDue - alreadyPaid;
                amountToAdd = Math.max(amountToAdd, dailyRoi); // At least daily
              } else {
                amountToAdd = dailyRoi;
              }

              const roiAmountNum = parseFloat(amountToAdd) || 0;
              const newBalanceNum = currentBalanceNum + roiAmountNum;
              const newRevenueNum = currentRevenueNum + roiAmountNum;

              logger.info(`Balance calculation debug:`, {
                investmentId: investment.id,
                userId: investment.userId,
                currentBalance: investment.user.walletBalance,
                currentRevenue: investment.user.revenue,
                roiAmount: amountToAdd,
                calculatedNewBalance: newBalanceNum,
                calculatedNewRevenue: newRevenueNum,
                daysElapsed,
                isLastDay
              });

              // Update both walletBalance and revenue
              await User.increment(
                { 
                  walletBalance: roiAmountNum,
                  revenue: roiAmountNum
                },
                { where: { id: investment.user.id } }
              );

              // Update investment: set payout_date to today (as last_daily_payout)
              await investment.update({
                payout_date: todayStart // Repurposed as last_daily_payout_date
              });

              if (isLastDay) {
                // Complete the investment on the last day
                await investment.update({
                  status: 'completed',
                  actual_roi: investment.expected_roi,
                  payout_date: endDate // Set final payout_date to end_date for completion record
                });
                logger.info(`✅ Completed investment ${investment.id} on last day`);
              } else {
                logger.info(`💸 Accrued daily ROI of ${amountToAdd} for investment ${investment.id} (day ${daysElapsed}/${durationDays})`);
              }

              result.processed++;
              
            } else {
              logger.debug(`⏭️ Skipping ${investment.id}: Already accrued for today`);
            }

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

        // Handle overdue completions (investments that ended but not marked)
        const overdueInvestments = await Investment.findAll({
          where: {
            status: 'active',
            end_date: { [Op.lt]: now },
            payout_date: null
          },
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'walletBalance', 'revenue', 'username']
          }]
        });

        for (const investment of overdueInvestments) {
          try {
            const endDate = new Date(investment.end_date);
            if (isNaN(endDate.getTime())) {
              throw new Error(`Invalid end_date for overdue investment ${investment.id}`);
            }

            const roiAmount = investment.expected_roi;
            const roiAmountNum = parseFloat(roiAmount) || 0;

            logger.info(`Balance calculation debug (overdue):`, {
              investmentId: investment.id,
              userId: investment.userId,
              currentBalance: investment.user.walletBalance,
              currentRevenue: investment.user.revenue,
              roiAmount: roiAmount
            });

            // Update both walletBalance and revenue for overdue investment
            await User.increment(
              { 
                walletBalance: roiAmountNum,
                revenue: roiAmountNum
              },
              { where: { id: investment.user.id } }
            );

            // Complete overdue investment
            await investment.update({
              status: 'completed',
              actual_roi: roiAmount,
              payout_date: now
            });

            result.processed++;
            
            logger.info(`💸 Paid overdue full ROI of ${roiAmount} to user ${investment.user.username} (${investment.user.id})`);

          } catch (error) {
            result.failed++;
            result.errors.push({
              investment_id: investment.id,
              user_id: investment.user.id,
              error: error.message
            });
            
            logger.error(`❌ Failed to process overdue investment ${investment.id}:`, error);
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