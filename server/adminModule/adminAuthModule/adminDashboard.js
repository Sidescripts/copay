// controllers/adminDashboardController.js
const { User, Withdrawal, Deposit, Investment, InvestmentPlan, sequelize } = require('../../model');
const { Op } = require('sequelize');

const adminDashboardController = {

    // Get overall dashboard statistics
    getDashboardStats: async (req, res) => {
        try {
            const [
                totalUsers,
                verifiedUsers,
                totalDeposits,
                totalWithdrawals,
                totalInvestments,
                pendingWithdrawals
            ] = await Promise.all([
                User.count(),
                User.count({ where: { isVerified: true } }),
                Deposit.sum('amount'),
                Withdrawal.sum('amount'),
                Investment.sum('amount'),
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
                    verifiedUsers: verifiedUsers || 0,
                    totalDeposits: parseFloat(totalDeposits) || 0,
                    totalWithdrawals: parseFloat(totalWithdrawals) || 0,
                    totalInvestments: parseFloat(totalInvestments) || 0,
                    pendingWithdrawals: pendingWithdrawals || 0
                },
                today: {
                    deposits: parseFloat(todayDeposits) || 0,
                    withdrawals: parseFloat(todayWithdrawals) || 0,
                    registrations: todayRegistrations || 0,
                    investments: parseFloat(todayInvestments) || 0
                }
            };
            // console.log(stats)
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
    }
};

module.exports = adminDashboardController;