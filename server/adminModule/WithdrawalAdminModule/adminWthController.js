// controllers/adminWithdrawalController.js
const { Withdrawal, User, sequelize } = require('../../model');
const { sendErrorResponse } = require('../../utils/commonUtils');

const adminWithdrawalController = {
    // Get all withdrawals with filtering options
    getAllWithdrawals: async (req, res) => {
        try {
            const { status, userId } = req.query;
            
            // Build where clause for filtering
            const whereClause = {};
            if (status) whereClause.status = status;
            if (userId) whereClause.userId = userId;

            const withdrawals = await Withdrawal.findAll({
                attributes: [
                    'id',
                    'transaction_id',
                    'amount',
                    'withdrawalMethod',
                    'walletAddress',
                    'status',
                    'createdAt',
                    'processed_at',
                    'completed_at',
                    'userId',
                ],
                where: whereClause,
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'email', 'username'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            return res.status(200).json({
                success: true,
                message: withdrawals.length ? 'Withdrawals retrieved successfully' : 'No withdrawals found',
                data: {
                    withdrawals: withdrawals,
                    total: withdrawals.length
                },
            });
        } catch (error) {
            console.error('Get all withdrawals error:', error);
            return sendErrorResponse(res, 500, 'Failed to retrieve withdrawals', error);
        }
    },

    // Approve, complete, or reject a withdrawal
    // controllers/adminWithdrawalController.js (only the update function)

    updateWithdrawalStatus: async (req, res) => {

        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required in request body',
            });
        }

        const validStatuses = ['confirmed', 'completed', 'failed', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed: ${validStatuses.join(', ')}`,
            });
        }

        let transaction;
        try {
            transaction = await Withdrawal.sequelize.transaction();  // Use your sequelize instance

            const withdrawal = await Withdrawal.findByPk(id, {
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email', 'username'],
                }],
                transaction,
                lock: transaction.LOCK.UPDATE,  // Prevent concurrent modifications
            });

            if (!withdrawal) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'Withdrawal record not found',
                });
            }

            // Prevent re-processing already final statuses
            const finalStatuses = ['completed', 'failed', 'rejected'];
            if (finalStatuses.includes(withdrawal.status)) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Cannot change status from final state: ${withdrawal.status}`,
                });
            }

            // Optional: only allow 'confirmed' → final status transitions
            // if (withdrawal.status === 'pending' && !['confirmed'].includes(status)) { ... }

            const updateData = {
                status,
                processed_at: new Date()
            };

            if (status === 'completed') {
                updateData.completed_at = new Date();
            }

            // Refund logic – only for rejected/failed
            if (status === 'failed' || status === 'rejected') {
                const amount = Number(withdrawal.amount);

                if (isNaN(amount) || amount <= 0) {
                    throw new Error(`Invalid refund amount: ${withdrawal.amount}`);
                }

                await User.update(
                    {
                        walletBalance: User.sequelize.literal(`\`walletBalance\` + ${amount}`),
                    },
                    {
                        where: { id: withdrawal.userId },
                        transaction,
                    }
                );
            }

            // Apply status update
            await withdrawal.update(updateData, { transaction });

            await transaction.commit();

            // Non-blocking notification
            try {
                console.log(`Withdrawal ${id} → ${status} | User: ${withdrawal.user?.email || 'unknown'}`);
                // await sendEmailNotification(withdrawal.user.email, status, id, amount);
            } catch (emailErr) {
                console.error('Notification failed:', emailErr);
            }

            return res.status(200).json({
                success: true,
                message: `Withdrawal marked as ${status}`,
                data: withdrawal,
            });

        } catch (error) {
            if (transaction) await transaction.rollback().catch(() => {});

            console.error('Update withdrawal status error:', {
                message: error.message,
                withdrawalId: id,
                attemptedStatus: status,
                stack: error.stack,
            });

            return res.status(500).json({
                success: false,
                message: 'Failed to update withdrawal status',
                error: error.message || 'Internal server error',
            });
        }
    },

    // Get withdrawal statistics for admin dashboard
    getWithdrawalStats: async (req, res) => {
        try {
            
            const stats = await Withdrawal.findAll({
                attributes: [
                    'status',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                    [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
                ],
                group: ['status'],
            });

            const totalWithdrawals = await Withdrawal.count();
            const totalAmount = await Withdrawal.sum('amount');

            return res.status(200).json({
                success: true,
                message: 'Withdrawal statistics retrieved successfully',
                data: {
                    stats: stats,
                    totalWithdrawals: totalWithdrawals,
                    totalAmount: totalAmount || 0
                },
            });
        } catch (error) {
            console.error('Get withdrawal stats error:', error);
            return sendErrorResponse(res, 500, 'Failed to retrieve withdrawal statistics', error);
        }
    },
};

module.exports = adminWithdrawalController;