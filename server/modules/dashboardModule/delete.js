const { User, Investment, Withdrawal, Sequelize } = require('../models');
const { Op } = Sequelize;

function DashboardController() {
  return {
    getCurrentUser: async function(req, res) {
      try {
        const userId = req.user.id;

        // Get user basic info
        const user = await User.findByPk(userId, {
          attributes: { 
            exclude: ['password', 'resetToken', 'resetTokenExpiry'] 
          }
        });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Calculate total investments (totalRevenue)
        const totalInvestments = await Investment.sum('amount', {
          where: { 
            userId: userId,
            status: { [Op.in]: ['active', 'completed'] }
          }
        });

        // Calculate total withdrawals
        const totalWithdrawals = await Withdrawal.sum('amount', {
          where: { 
            userId: userId,
            status: 'completed'
          }
        });

        // Calculate active investments amount
        const activeInvestments = await Investment.sum('amount', {
          where: { 
            userId: userId,
            status: 'active'
          }
        });

        // Calculate pending withdrawals
        const pendingWithdrawals = await Withdrawal.sum('amount', {
          where: { 
            userId: userId,
            status: 'pending'
          }
        });

        // Calculate total ROI earned from completed investments
        const totalROI = await Investment.sum('actual_roi', {
          where: { 
            userId: userId,
            status: 'completed'
          }
        });

        // Get investment count by status
        const investmentStats = await Investment.findAll({
          where: { userId: userId },
          attributes: [
            'status',
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
            [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_amount']
          ],
          group: ['status']
        });

        // Format investment stats
        const investmentStatus = investmentStats.reduce((acc, stat) => {
          acc[stat.status] = {
            count: parseInt(stat.get('count')),
            amount: parseFloat(stat.get('total_amount') || 0)
          };
          return acc;
        }, {});

        // Prepare response
        const userResponse = user.toJSON();
        
        userResponse.dashboardStats = {
          walletBalance: user.walletBalance || 0,
          totalRevenue: parseFloat(totalInvestments || 0),
          totalWithdrawal: parseFloat(totalWithdrawals || 0),
          activeInvestments: parseFloat(activeInvestments || 0),
          pendingWithdrawals: parseFloat(pendingWithdrawals || 0),
          totalROI: parseFloat(totalROI || 0),
          netEarnings: parseFloat(totalROI || 0) - parseFloat(totalInvestments || 0),
          investmentStatus: investmentStatus
        };

        return res.json(userResponse);

      } catch (error) {
        console.error('Get user dashboard error:', error);
        return res.status(500).json({ error: 'Failed to fetch user dashboard' });
      }
    },

    // Additional method: Get detailed investment breakdown
    getInvestmentBreakdown: async function(req, res) {
      try {
        const userId = req.user.id;

        const investments = await Investment.findAll({
          where: { userId: userId },
          include: [{
            model: InvestmentPlan,
            as: 'plan',
            attributes: ['name', 'roi_percentage']
          }],
          order: [['createdAt', 'DESC']],
          attributes: [
            'id', 'amount', 'expected_roi', 'actual_roi', 'status',
            'start_date', 'end_date', 'payout_date', 'createdAt'
          ]
        });

        return res.json({ investments });

      } catch (error) {
        console.error('Get investment breakdown error:', error);
        return res.status(500).json({ error: 'Failed to fetch investment breakdown' });
      }
    },

    // Additional method: Get recent transactions
    getRecentActivity: async function(req, res) {
      try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 10;

        // Get recent investments
        const recentInvestments = await Investment.findAll({
          where: { userId: userId },
          order: [['createdAt', 'DESC']],
          limit: limit,
          attributes: ['id', 'amount', 'asset', 'status', 'createdAt']
        });

        // Get recent withdrawals (if you have withdrawal model)
        const recentWithdrawals = await Withdrawal.findAll({
          where: { userId: userId },
          order: [['createdAt', 'DESC']],
          limit: limit,
          attributes: ['id', 'amount', 'asset', 'status', 'createdAt']
        });

        // Combine and sort activities
        const activities = [
          ...recentInvestments.map(inv => ({
            type: 'investment',
            id: inv.id,
            amount: inv.amount,
            asset: inv.asset,
            status: inv.status,
            date: inv.createdAt
          })),
          ...recentWithdrawals.map(wd => ({
            type: 'withdrawal',
            id: wd.id,
            amount: wd.amount,
            asset: wd.asset,
            status: wd.status,
            date: wd.createdAt
          }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date))
         .slice(0, limit);

        return res.json({ activities });

      } catch (error) {
        console.error('Get recent activity error:', error);
        return res.status(500).json({ error: 'Failed to fetch recent activity' });
      }
    }
  };
}

module.exports = DashboardController();