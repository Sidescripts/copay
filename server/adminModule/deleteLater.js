// controllers/adminDashboardController.js
const { User, Withdrawal, Deposit, Investment, InvestmentPlan, sequelize } = require('../model');
const { Op } = require('sequelize');

const adminDashboardController = {

    // Get overall dashboard statistics
    getDashboardStats: async (req, res) => {
        try {
            const [
                totalUsers,
                activeUsers,
                verifiedUsers,
                totalDeposits,
                totalWithdrawals,
                totalInvestments,
                pendingDeposits,
                pendingWithdrawals
            ] = await Promise.all([
                User.count(),
                User.count({ where: { status: 'active' } }),
                User.count({ where: { isVerified: true } }),
                Deposit.sum('amount'),
                Withdrawal.sum('amount'),
                Investment.sum('amount'),
                Deposit.count({ where: { status: 'pending' } }),
                Withdrawal.count({ where: { status: 'pending' } })
            ]);

            // Get today's statistics
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);

            const [
                todayDeposits,
                todayWithdrawals,
                todayRegistrations,
                todayInvestments
            ] = await Promise.all([
                Deposit.sum('amount', { 
                    where: { 
                        createdAt: { [Op.between]: [todayStart, todayEnd] } 
                    } 
                }),
                Withdrawal.sum('amount', { 
                    where: { 
                        createdAt: { [Op.between]: [todayStart, todayEnd] } 
                    } 
                }),
                User.count({ 
                    where: { 
                        createdAt: { [Op.between]: [todayStart, todayEnd] } 
                    } 
                }),
                Investment.sum('amount', { 
                    where: { 
                        createdAt: { [Op.between]: [todayStart, todayEnd] } 
                    } 
                })
            ]);

            const stats = {
                overview: {
                    totalUsers: totalUsers || 0,
                    activeUsers: activeUsers || 0,
                    verifiedUsers: verifiedUsers || 0,
                    totalDeposits: parseFloat(totalDeposits) || 0,
                    totalWithdrawals: parseFloat(totalWithdrawals) || 0,
                    totalInvestments: parseFloat(totalInvestments) || 0,
                    pendingDeposits: pendingDeposits || 0,
                    pendingWithdrawals: pendingWithdrawals || 0
                },
                today: {
                    deposits: parseFloat(todayDeposits) || 0,
                    withdrawals: parseFloat(todayWithdrawals) || 0,
                    registrations: todayRegistrations || 0,
                    investments: parseFloat(todayInvestments) || 0
                }
            };

            return res.status(200).json({
                success: true,
                data: stats
            });

        } catch (error) {
            console.error('Get dashboard stats error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch dashboard statistics'
            });
        }
    },

    // Get financial statistics
    getFinancialStats: async (req, res) => {
        try {
            const { period = '30d' } = req.query; // 7d, 30d, 90d, 1y
            
            const days = parseInt(period);
            const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

            // Get daily financial data for the period
            const financialData = await Deposit.findAll({
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                    [sequelize.fn('SUM', sequelize.col('amount')), 'dailyDeposits'],
                    [
                        sequelize.literal(`(
                            SELECT SUM(amount) FROM withdrawals 
                            WHERE DATE(createdAt) = DATE(deposits.createdAt)
                        )`),
                        'dailyWithdrawals'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT SUM(amount) FROM investments 
                            WHERE DATE(createdAt) = DATE(deposits.createdAt)
                        )`),
                        'dailyInvestments'
                    ]
                ],
                where: {
                    createdAt: { [Op.gte]: startDate }
                },
                group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
                order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
                raw: true
            });

            // Get revenue calculation (investments - withdrawals)
            const revenueStats = await Investment.findAll({
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('expected_roi')), 'totalExpectedROI'],
                    [sequelize.fn('SUM', sequelize.col('actual_roi')), 'totalActualROI']
                ],
                where: {
                    status: 'completed'
                },
                raw: true
            });

            const financialStats = {
                period: period,
                startDate: startDate,
                endDate: new Date(),
                dailyData: financialData,
                revenue: {
                    totalExpectedROI: parseFloat(revenueStats[0]?.totalExpectedROI) || 0,
                    totalActualROI: parseFloat(revenueStats[0]?.totalActualROI) || 0,
                    netRevenue: (parseFloat(revenueStats[0]?.totalActualROI) || 0) - (parseFloat(await Withdrawal.sum('amount')) || 0)
                }
            };

            return res.status(200).json({
                success: true,
                data: financialStats
            });

        } catch (error) {
            console.error('Get financial stats error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch financial statistics'
            });
        }
    },

    // Get user growth statistics
    getUserGrowthStats: async (req, res) => {
        try {
            const { period = '30d' } = req.query;
            const days = parseInt(period);
            const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

            const userGrowth = await User.findAll({
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'newUsers'],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*) FROM users 
                            WHERE DATE(createdAt) <= DATE(u.createdAt)
                        )`),
                        'totalUsers'
                    ]
                ],
                where: {
                    createdAt: { [Op.gte]: startDate }
                },
                group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
                order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
                raw: true
            });

            // Get verification statistics
            const verificationStats = await User.findAll({
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
                    [sequelize.fn('SUM', sequelize.literal('CASE WHEN isVerified THEN 1 ELSE 0 END')), 'verified'],
                    [sequelize.fn('SUM', sequelize.literal('CASE WHEN status = "active" THEN 1 ELSE 0 END')), 'active']
                ],
                raw: true
            });

            const growthStats = {
                period: period,
                dailyGrowth: userGrowth,
                verificationRate: verificationStats[0] ? 
                    (verificationStats[0].verified / verificationStats[0].total * 100).toFixed(2) : 0,
                activeUserRate: verificationStats[0] ? 
                    (verificationStats[0].active / verificationStats[0].total * 100).toFixed(2) : 0
            };

            return res.status(200).json({
                success: true,
                data: growthStats
            });

        } catch (error) {
            console.error('Get user growth stats error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch user growth statistics'
            });
        }
    },

    // Get recent activities
    getRecentActivities: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;

            const [recentDeposits, recentWithdrawals, recentInvestments, newUsers] = await Promise.all([
                Deposit.findAll({
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email']
                    }],
                    order: [['createdAt', 'DESC']],
                    limit: limit
                }),
                Withdrawal.findAll({
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email']
                    }],
                    order: [['createdAt', 'DESC']],
                    limit: limit
                }),
                Investment.findAll({
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'username', 'email']
                        },
                        {
                            model: InvestmentPlan,
                            as: 'plan',
                            attributes: ['name']
                        }
                    ],
                    order: [['createdAt', 'DESC']],
                    limit: limit
                }),
                User.findAll({
                    attributes: ['id', 'username', 'email', 'createdAt'],
                    order: [['createdAt', 'DESC']],
                    limit: limit
                })
            ]);

            const activities = {
                recentDeposits,
                recentWithdrawals,
                recentInvestments,
                newUsers
            };

            return res.status(200).json({
                success: true,
                data: activities
            });

        } catch (error) {
            console.error('Get recent activities error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch recent activities'
            });
        }
    },

    // Get pending actions requiring admin attention
    getPendingActions: async (req, res) => {
        try {
            const [pendingDeposits, pendingWithdrawals, unverifiedUsers] = await Promise.all([
                Deposit.findAll({
                    where: { status: 'pending' },
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email']
                    }],
                    order: [['createdAt', 'DESC']],
                    limit: 20
                }),
                Withdrawal.findAll({
                    where: { status: 'pending' },
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email']
                    }],
                    order: [['createdAt', 'DESC']],
                    limit: 20
                }),
                User.findAll({
                    where: { isVerified: false },
                    attributes: ['id', 'username', 'email', 'createdAt'],
                    order: [['createdAt', 'DESC']],
                    limit: 20
                })
            ]);

            const pendingActions = {
                pendingDeposits: {
                    count: pendingDeposits.length,
                    items: pendingDeposits
                },
                pendingWithdrawals: {
                    count: pendingWithdrawals.length,
                    items: pendingWithdrawals
                },
                unverifiedUsers: {
                    count: unverifiedUsers.length,
                    items: unverifiedUsers
                }
            };

            return res.status(200).json({
                success: true,
                data: pendingActions
            });

        } catch (error) {
            console.error('Get pending actions error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch pending actions'
            });
        }
    },

    // Get investment plan performance statistics
    getInvestmentPerformance: async (req, res) => {
        try {
            const planPerformance = await InvestmentPlan.findAll({
                attributes: [
                    'id',
                    'name',
                    'roi_percentage',
                    [sequelize.fn('COUNT', sequelize.col('investments.id')), 'totalInvestments'],
                    [sequelize.fn('SUM', sequelize.col('investments.amount')), 'totalInvested'],
                    [sequelize.fn('SUM', sequelize.col('investments.expected_roi')), 'totalExpectedROI'],
                    [sequelize.fn('SUM', sequelize.col('investments.actual_roi')), 'totalActualROI']
                ],
                include: [{
                    model: Investment,
                    as: 'investments',
                    attributes: [],
                    required: false
                }],
                group: ['InvestmentPlan.id'],
                order: [[sequelize.literal('totalInvested'), 'DESC']]
            });

            // Calculate success rate for each plan
            const performanceWithRates = planPerformance.map(plan => {
                const data = plan.get({ plain: true });
                const successRate = data.totalExpectedROI > 0 ? 
                    (data.totalActualROI / data.totalExpectedROI * 100).toFixed(2) : 0;
                
                return {
                    ...data,
                    successRate: parseFloat(successRate),
                    totalInvested: parseFloat(data.totalInvested) || 0,
                    totalExpectedROI: parseFloat(data.totalExpectedROI) || 0,
                    totalActualROI: parseFloat(data.totalActualROI) || 0
                };
            });

            return res.status(200).json({
                success: true,
                data: performanceWithRates
            });

        } catch (error) {
            console.error('Get investment performance error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch investment performance'
            });
        }
    },

    // Get system health metrics
    getSystemHealth: async (req, res) => {
        try {
            const [dbStatus, activeSessions, systemUptime] = await Promise.all([
                // Check database connection
                sequelize.authenticate().then(() => 'healthy').catch(() => 'unhealthy'),
                
                // Get active sessions (you might need to implement this based on your session store)
                User.count({ where: { lastLogin: { [Op.gte]: new Date(Date.now() - 30 * 60 * 1000) } } }),
                
                // System uptime (you might want to implement this differently)
                process.uptime()
            ]);

            const healthMetrics = {
                database: dbStatus,
                activeSessions: activeSessions,
                systemUptime: Math.floor(systemUptime),
                timestamp: new Date(),
                serverTime: new Date().toISOString()
            };

            return res.status(200).json({
                success: true,
                data: healthMetrics
            });

        } catch (error) {
            console.error('Get system health error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch system health metrics'
            });
        }
    }

};

module.exports = adminDashboardController;