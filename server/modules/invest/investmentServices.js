const { Investment, User } = require('../../model');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');

function ROIService() {
  return {
    processCompletedInvestments: async function () {
      const result = { processed: 0, failed: 0, errors: [] };

      try {
        const now = new Date();
        logger.debug(`🔍 Starting daily ROI accrual check at: ${now.toISOString()}`);

        // Find active investments that have started and not yet ended
        const activeInvestments = await Investment.findAll({
          where: {
            status: 'active',
            start_date: { [Op.lte]: now },
            end_date: { [Op.gte]: now },
          },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'walletBalance', 'username'],
            },
          ],
        });

        logger.debug(`📊 Found ${activeInvestments.length} active investments eligible for accrual`);

        const ONE_DAY_MS = 1000 * 60 * 60 * 24;

        for (const investment of activeInvestments) {
          try {
            const startDate = new Date(investment.start_date);
            const endDate = new Date(investment.end_date);

            // Defensive check
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              throw new Error('Invalid date format in start_date or end_date');
            }

            const durationDays = Math.ceil((endDate - startDate) / ONE_DAY_MS);
            const dailyRoi = parseFloat(investment.expected_roi) / durationDays;

            const currentBalance = parseFloat(investment.user.walletBalance) || 0;

            // Last payout date (falls back to start date if never paid)
            const lastPayoutDate = investment.payout_date
              ? new Date(investment.payout_date)
              : new Date(startDate);

            // Start of today (midnight)
            const todayStart = new Date(now);
            todayStart.setHours(0, 0, 0, 0);

            if (todayStart <= lastPayoutDate) {
              logger.debug(`⏭️ Skipping ${investment.id} — already processed today`);
              continue;
            }

            // Start of the investment day
            const startDay = new Date(startDate);
            startDay.setHours(0, 0, 0, 0);

            const daysElapsed = Math.floor((todayStart - startDay) / ONE_DAY_MS) + 1;

            // Prepare end-of-day boundary for today
            const todayEnd = new Date(todayStart);
            todayEnd.setHours(23, 59, 59, 999);

            // Is today the final day?
            const endDayStart = new Date(endDate);
            endDayStart.setHours(0, 0, 0, 0);

            const isLastDay = todayStart.getTime() >= endDayStart.getTime();

            let amountToAdd = dailyRoi;

            if (isLastDay) {
              // On last day: pay remaining amount (approximate — better if you track total_paid)
              const totalExpected = parseFloat(investment.expected_roi);
              const alreadyPaidApprox = dailyRoi * (daysElapsed - 1);
              amountToAdd = totalExpected - alreadyPaidApprox;
              amountToAdd = Math.max(amountToAdd, dailyRoi); // at minimum pay daily rate
              amountToAdd = Math.min(amountToAdd, totalExpected); // never exceed total
            }

            const roiAmount = parseFloat(amountToAdd.toFixed(8)) || 0;
            const newBalanceNum = currentBalance + roiAmount;
            const newBalance = newBalanceNum.toFixed(8);

            logger.info(`ROI accrual`, {
              investmentId: investment.id,
              userId: investment.user.id,
              username: investment.user.username,
              currentBalance,
              roiAmount,
              newBalance,
              daysElapsed,
              durationDays,
              isLastDay,
            });

            // Update wallet
            await User.update(
              { walletBalance: newBalance },
              { where: { id: investment.user.id } }
            );

            // Mark today's payout
            await investment.update({
              payout_date: todayStart,
            });

            if (isLastDay) {
              // Finalize investment
              await investment.update({
                status: 'completed',
                actual_roi: investment.expected_roi,
                payout_date: endDate, // final completion timestamp
              });
              logger.info(`✅ Investment ${investment.id} completed (last day)`);
            } else {
              logger.info(`💸 Daily ROI of ${roiAmount} added to investment ${investment.id} (day ${daysElapsed}/${durationDays})`);
            }

            result.processed++;

          } catch (error) {
            result.failed++;
            result.errors.push({
              investment_id: investment.id,
              user_id: investment.user?.id,
              error: error.message,
            });
            logger.error(`❌ Failed to process investment ${investment.id}: ${error.message}`, { stack: error.stack });
          }
        }

        // Handle overdue investments (ended but still active)
        const overdueInvestments = await Investment.findAll({
          where: {
            status: 'active',
            end_date: { [Op.lt]: now },
          },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'walletBalance', 'username'],
            },
          ],
        });

        for (const investment of overdueInvestments) {
          try {
            const roiAmount = parseFloat(investment.expected_roi) || 0;
            const currentBalance = parseFloat(investment.user.walletBalance) || 0;
            const newBalance = (currentBalance + roiAmount).toFixed(8);

            logger.info(`Overdue full ROI payout`, {
              investmentId: investment.id,
              userId: investment.user.id,
              username: investment.user.username,
              roiAmount,
              newBalance,
            });

            await User.update(
              { walletBalance: newBalance },
              { where: { id: investment.user.id } }
            );

            await investment.update({
              status: 'completed',
              actual_roi: roiAmount,
              payout_date: now,
            });

            result.processed++;

            logger.info(`💸 Overdue ROI ${roiAmount} paid — investment ${investment.id} completed`);

          } catch (error) {
            result.failed++;
            result.errors.push({
              investment_id: investment.id,
              user_id: investment.user?.id,
              error: error.message,
            });
            logger.error(`❌ Failed overdue investment ${investment.id}: ${error.message}`);
          }
        }

        logger.info(`ROI processing finished`, {
          processed: result.processed,
          failed: result.failed,
          errorsCount: result.errors.length,
        });

        return result;

      } catch (error) {
        logger.error('❌ Critical ROI processing failure:', error);
        result.errors.push({ error: error.message });
        return result;
      }
    },
  };
}

module.exports = {
  ROIService: ROIService(),
  processCompletedInvestments: ROIService().processCompletedInvestments,
};