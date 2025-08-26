const cron = require('node-cron');
const { ROIService } = require('./investmentServices');
const logger = require('../../utils/logger');

function startROICron() {
    let cronSchedule;
    let scheduleDescription;
    
    // Set cron schedule based on environment
    switch(process.env.NODE_ENV) {
        case 'production':
            cronSchedule = '0 0,12 * * *'; // Every 12 hours at 00:00 and 12:00
            scheduleDescription = 'Every 12 hours (00:00 and 12:00 UTC)';
            break;
        case 'staging':
            cronSchedule = '0 */6 * * *'; // Every 6 hours at minute 0
            scheduleDescription = 'Every 6 hours';
            break;
        case 'development':
            cronSchedule = '0 */1 * * *'; // Every hour at minute 0
            scheduleDescription = 'Every hour (development mode)';
            break;
        default:
            cronSchedule = '0 0,12 * * *';
            scheduleDescription = 'Every 12 hours (default)';
    }
    
    // Schedule the cron job
    cron.schedule(cronSchedule, async function() {
        try {
            const startTime = new Date();
            logger.info(`🕛 Starting scheduled ROI payout check at ${startTime.toISOString()}`);
            
            // Process completed investments
            const result = await ROIService.processCompletedInvestments();
            
            const endTime = new Date();
            const duration = endTime - startTime;
            
            // Log results
            if (result.processed > 0) {
                logger.info(`💰 Successfully paid out ${result.processed} investments`);
            }
            
            if (result.failed > 0) {
                logger.warn(`⚠️  ${result.failed} investments failed to process`);
                
                // Log individual errors for debugging
                result.errors.forEach((error, index) => {
                    logger.error(`   Error ${index + 1}: Investment ${error.investment_id} - ${error.error}`);
                });
            }
            
            if (result.processed === 0 && result.failed === 0) {
                logger.info('✅ No completed investments found for payout');
            }
            
            logger.info(`⏱️  ROI processing completed in ${duration}ms`);
            
        } catch (error) {
            logger.error('❌ ROI cron job execution failed:', error);
        }
    });
    
    // Log the cron schedule
    logger.info(`⏰ ROI cron job scheduled: ${scheduleDescription}`);
    logger.info(`   Cron pattern: ${cronSchedule}`);
    logger.info(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Optional: Run immediate test in development
    if (process.env.NODE_ENV === 'development' && process.env.RUN_IMMEDIATE_ROI === 'true') {
        setTimeout(async () => {
            logger.info('🔍 Development mode: Running initial ROI check in 5 seconds...');
            try {
                const result = await ROIService.processCompletedInvestments();
                logger.info(`🧪 Initial ROI test completed: ${result.processed} processed, ${result.failed} failed`);
            } catch (error) {
                logger.error('❌ Initial ROI test failed:', error);
            }
        }, 5000);
    }
}

// Handle cron job errors
process.on('unhandledRejection', (reason, promise) => {
    logger.error('💥 Unhandled Rejection in ROI cron:', reason);
});

process.on('uncaughtException', (error) => {
    logger.error('💥 Uncaught Exception in ROI cron:', error);
});

module.exports = { startROICron };