// controllers/adminWithdrawalController.js
const { Withdrawal, User, sequelize } = require('../../model');
const { handleValidationErrors, sendErrorResponse } = require('../../utils/commonUtils');

const adminWithdrawalController = {
    // Get all withdrawals with filtering options
    getAllWithdrawals: async (req, res) => {
        try {
            const validationError = handleValidationErrors(req);
            if (validationError) return validationError;

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
    updateWithdrawalStatus: async (req, res) => {
        const transaction = await sequelize.transaction();
        
        try {
            const validationError = handleValidationErrors(req);
            if (validationError) {
                await transaction.rollback();
                return validationError;
            }

            const { id } = req.params;
            const { status, adminNotes } = req.body; // status: 'confirmed', 'completed', 'failed', 'rejected'

            // Validate required fields
            if (!status) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'Status is required',
                });
            }

            // Validate status value
            const validStatuses = ['confirmed', 'completed', 'failed', 'rejected'];
            if (!validStatuses.includes(status)) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
                });
            }

            // Find withdrawal with user data
            const withdrawal = await Withdrawal.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'email', 'username'],
                    },
                ],
                transaction
            });

            if (!withdrawal) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'Withdrawal not found',
                });
            }

            // Validate withdrawal can be updated
            if (withdrawal.status !== 'pending' && withdrawal.status !== 'confirmed') {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Withdrawal cannot be updated from ${withdrawal.status} status`,
                });
            }

            // Handle status-specific logic
            const updateData = {
                status: status,
                processed_at: new Date(),
                processed_by: req.user.id, // Track which admin processed this
            };

            if (adminNotes) {
                updateData.admin_notes = adminNotes;
            }

            // Set completed_at for completed withdrawals
            if (status === 'completed') {
                updateData.completed_at = new Date();
            }

            // For failed/rejected withdrawals, refund the amount to user's wallet
            if (status === 'failed' || status === 'rejected') {
                await User.update(
                    { walletBalance: sequelize.literal(`"walletBalance" + ${withdrawal.amount}`) },
                    { where: { id: withdrawal.userId }, transaction }
                );
            }

            await withdrawal.update(updateData, { transaction });
            await transaction.commit();

            // Send notification email (non-blocking)
            try {
                // You would implement your email service here
                console.log(`Withdrawal ${id} status updated to ${status} for user ${withdrawal.user.email}`);
            } catch (emailError) {
                console.error('Failed to send notification:', emailError);
            }

            return res.status(200).json({
                success: true,
                message: `Withdrawal ${status} successfully`,
                data: withdrawal,
            });

        } catch (error) {
            await transaction.rollback();
            console.error('Update withdrawal status error:', error);
            return sendErrorResponse(res, 500, 'Failed to update withdrawal status', error);
        }
    },

    // Get withdrawal statistics for admin dashboard
    getWithdrawalStats: async (req, res) => {
        try {
            const validationError = handleValidationErrors(req);
            if (validationError) return validationError;

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