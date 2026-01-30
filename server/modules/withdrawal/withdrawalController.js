const { Withdrawal, sequelize, User } = require('../../model');
const { sendErrorResponse } = require('../../utils/commonUtils');
const { v4: uuidv4 } = require('uuid');
const EmailTemplate = require("./withdrawalEmail");
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

const userWithdrawalController = {
    // Create a new withdrawal
    createWithdrawal: async (req, res) => {
        
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            const { amount, withdrawalMethod, walletAddress } = req.body;
            const userId = req.user.id;
            
            // Verify all required fields are present
            const missingFields = [];
            if (!amount) missingFields.push('amount');
            if (!withdrawalMethod) missingFields.push('withdrawalMethod');
            if (!walletAddress) missingFields.push('walletAddress');
            if (!userId) missingFields.push('userId');
            
            if (missingFields.length > 0) {
                // await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    error: `Missing required fields: ${missingFields.join(', ')}`
                });
            }
    
            // Security check: ensure authenticated user matches requested userId
            if (!req.user || !req.user.id) {
                // await transaction.rollback();
                return res.status(403).json({
                    success: false,
                    error: "Unauthorized: Cannot create withdrawal for another user"
                });
            }
    
            // Retrieve user with necessary attributes
            const user = await User.findByPk(userId, {
                attributes: ['id', 'walletBalance', 'totalRevenue', 'isVerified', 'email']
            });
    
            if (!user) {
                // await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    error: "User not found"
                });
            }
            
            const {walletBalance,email, totalWithdrawal } = user;
    
            // Business rule validation
            if (amount < 1000) {
                // await transaction.rollback();
                
                return res.status(400).json({
                    success: false,
                    
                    error: "Minimum withdrawal is $1,000"
                });
            }
            
            if (amount > walletBalance) {
                
                
                return res.status(400).json({
                    success: false,
                    error: "Insufficient wallet balance"
                });
            }
    
            const now = new Date();
            const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
            const random = Math.floor(10000 + Math.random() * 90000); // 5-digit random    
            // console.log(`txn_${timestamp}${random}`)
            
            // Create withdrawal record
            const withdrawal = await Withdrawal.create({
                id: uuidv4(),
                amount,
                withdrawalMethod,
                walletAddress,
                transaction_id: `txn_${timestamp}${random}`,
                userId,
                status: 'pending',
                createdAt: new Date(),
            });
    
            // Update user wallet balance
            await User.update(
                { 
                    walletBalance: walletBalance - amount, 
                    totalWithdrawal: (totalWithdrawal || 0) + amount
                },
                { where: { id: userId } }
            );

           
    
            // Send notification email
            try {
                await EmailTemplate.withdrawalEmail({
                    email: user.email,
                    amount: withdrawal.amount,
                    transactionId: withdrawal.transaction_id,
                    status: withdrawal.status
                });
            } catch (emailError) {
                // Log email error but don't fail the transaction
                console.error("Failed to send withdrawal email:", emailError);
            }
    
            return res.status(201).json({
                success: true,
                message: 'Withdrawal created successfully',
                withdrawal
            });
        } catch (error) {
            
            
            console.error("Withdrawal creation error:", error);
            
            return sendErrorResponse(res, 500, 'Failed to create withdrawal', error.message);
        }
    },

    // Get all withdrawals for a specific user
    getUserWithdrawals: async (req, res) => {
        
        const userId = req.user.id;
        
        try {
            const withdrawals = await Withdrawal.findAll({
                where: { userId },
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
                ],
                order: [['createdAt', 'DESC']],
            });

            return res.status(200).json({
                success: true,
                message: withdrawals.length ? 'Withdrawal history retrieved successfully' : 'No withdrawals found',
                withdrawals
            });
        } catch (error) {
            return sendErrorResponse(res, 500, 'Failed to retrieve withdrawal history', error);
        }
    },

    // Get a specific withdrawal by ID
    getWithdrawal: async (req, res) => {
        
        const { id } = req.params;

        try {
            const withdrawal = await Withdrawal.findByPk(id, {
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
            });

            if (!withdrawal) {
                return res.status(404).json({
                    success: false,
                    message: 'Withdrawal not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Withdrawal retrieved successfully',
                data: withdrawal,
            });
        } catch (error) {
            return sendErrorResponse(res, 500, 'Failed to retrieve withdrawal', error);
        }
    },
};

module.exports = userWithdrawalController;