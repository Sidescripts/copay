// controllers/adminUserController.js
const { User, Withdrawal, Deposit, Investment, sequelize } = require('../../model');
const { Op } = require('sequelize');

const adminUserController = {

    // Get all registered users with optional filters
    getAllUsers: async (req, res) => {
        try {
            const { 
                isVerified,  
                search, 
                page = 1, 
                limit = 20 
            } = req.query;

            const whereClause = {};
            
            // Filter by verification status
            if (isVerified !== undefined) {
                whereClause.isVerified = isVerified === 'true';
            }
            
            // Search by email, username, or ID
            if (search) {
                whereClause[Op.or] = [
                    { email: { [Op.like]: `%${search}%` } },
                    { username: { [Op.like]: `%${search}%` } },
                    sequelize.where(sequelize.cast(sequelize.col('User.id'), 'VARCHAR'), {
                        [Op.like]: `%${search}%`
                    })
                ];
            }

            const users = await User.findAndCountAll({
                where: whereClause,
                attributes: [
                    'id',
                    'email',
                    'username',
                    'firstName',
                    'lastName',
                    'walletBalance',
                    'totalRevenue',
                    'totalWithdrawal',
                    'isVerified',
                    'status',
                    'createdAt',
                ],
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: (parseInt(page) - 1) * parseInt(limit)
            });

            return res.status(200).json({
                success: true,
                data: {
                    users: users.rows,
                    total: users.count,
                    totalPages: Math.ceil(users.count / limit),
                    currentPage: parseInt(page)
                }
            });

        } catch (error) {
            console.error('Get all users error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch users'
            });
        }
    },

    // Get user details with full information
    getUserDetails: async (req, res) => {
        try {
            const { userId } = req.params;

            const user = await User.findByPk(userId, {
                attributes: [
                    'id',
                    'email',
                    'username',
                    'firstName',
                    'lastName',
                    'walletBalance',
                    'totalRevenue',
                    'totalWithdrawal',
                    'isVerified',
                    'status',
                    'createdAt',
                    'phoneNum',
                    'country'
                ],
                include: [
                    {
                        model: Withdrawal,
                        as: 'withdrawals',
                        attributes: ['id', 'amount', 'status', 'createdAt'],
                        order: [['createdAt', 'DESC']],
                        limit: 10
                    },
                    {
                        model: Deposit,
                        as: 'deposits',
                        attributes: ['id', 'amount', 'status', 'createdAt'],
                        order: [['createdAt', 'DESC']],
                        limit: 10
                    },
                    {
                        model: Investment,
                        as: 'investments',
                        attributes: ['id', 'amount', 'status', 'expected_roi'],
                        include: [{
                            model: InvestmentPlan,
                            as: 'plan',
                            attributes: ['name', 'roi_percentage']
                        }],
                        order: [['createdAt', 'DESC']],
                        limit: 10
                    }
                ]
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: user
            });

        } catch (error) {
            console.error('Get user details error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch user details'
            });
        }
    },

    // Verify user account
    verifyUser: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const { userId } = req.params;
            
            const user = await User.findByPk(userId, { transaction });

            if (!user) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (user.isVerified) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'User is already verified'
                });
            }

            await user.update({
                isVerified: true,
            }, { transaction });

            await transaction.commit();

            // Send verification email (optional)
            try {
                // Implement your email service here
                console.log(`User ${user.email} has been verified`);
            } catch (emailError) {
                console.error('Failed to send verification email:', emailError);
            }

            return res.status(200).json({
                success: true,
                message: 'User verified successfully',
                data: user
            });

        } catch (error) {
            await transaction.rollback();
            console.error('Verify user error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to verify user'
            });
        }
    },

    // Update user's total withdrawal amount
    updateTotalWithdrawal: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const { userId } = req.params;
            const { totalWithdrawal, action, amount, reason } = req.body;

            const user = await User.findByPk(userId, { transaction });

            if (!user) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            let newTotalWithdrawal;

            if (totalWithdrawal !== undefined) {
                // Direct set total withdrawal
                newTotalWithdrawal = parseFloat(totalWithdrawal);
            } else if (action && amount) {
                // Increment or decrement total withdrawal
                const adjustment = parseFloat(amount);
                
                if (action === 'add') {
                    newTotalWithdrawal = (user.totalWithdrawal || 0) + adjustment;
                } else if (action === 'subtract') {
                    newTotalWithdrawal = Math.max(0, (user.totalWithdrawal || 0) - adjustment);
                } else {
                    await transaction.rollback();
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid action. Use "add" or "subtract"'
                    });
                }
            } else {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'Either totalWithdrawal or action with amount is required'
                });
            }

            await user.update({
                totalWithdrawal: newTotalWithdrawal,
            }, { transaction });

            await transaction.commit();

            return res.status(200).json({
                success: true,
                message: 'Total withdrawal updated successfully',
                data: {
                    userId: user.id,
                    oldTotalWithdrawal: user.totalWithdrawal,
                    newTotalWithdrawal: newTotalWithdrawal
                }
            });

        } catch (error) {
            await transaction.rollback();
            console.error('Update total withdrawal error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update total withdrawal'
            });
        }
    },

    // Update user wallet balance
    updateWalletBalance: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const { userId } = req.params;
            const { action, amount } = req.body;

            const user = await User.findByPk(userId, { transaction });

            if (!user) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (!action || !amount) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'Action and amount are required'
                });
            }

            const adjustment = parseFloat(amount);
            let newBalance;

            if (action === 'add') {
                newBalance = (user.walletBalance || 0) + adjustment;
            } else if (action === 'subtract') {
                if ((user.walletBalance || 0) < adjustment) {
                    await transaction.rollback();
                    return res.status(400).json({
                        success: false,
                        message: 'Insufficient balance for deduction'
                    });
                }
                newBalance = (user.walletBalance || 0) - adjustment;
            } else {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'Invalid action. Use "add" or "subtract"'
                });
            }

            await user.update({
                walletBalance: newBalance,
            }, { transaction });

            await transaction.commit();

            return res.status(200).json({
                success: true,
                message: `Wallet balance ${action === 'add' ? 'increased' : 'decreased'} successfully`,
                data: {
                    userId: user.id,
                    oldBalance: user.walletBalance,
                    newBalance: newBalance,
                    adjustment: adjustment
                }
            });

        } catch (error) {
            await transaction.rollback();
            console.error('Update wallet balance error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update wallet balance'
            });
        }
    }
};

module.exports = adminUserController;