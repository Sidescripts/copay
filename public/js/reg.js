// server/modules/withdrawal/withdrawalController.js
const { handleValidationErrors } = require('../../utils/commonUtils');
const { sequelize, User, Withdrawal } = require('../../models'); // Adjust path to your models
const { v4: uuidv4 } = require('uuid');
const EmailTemplate = require('../../utils/emailTemplate'); // Adjust path
const { sendErrorResponse } = require('../../utils/responseUtils'); // Adjust path
const { generateTransactionId } = require('../../utils/transactionUtils'); // Adjust path

const createWithdrawal = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // Input validation is handled by middleware
    const { amount, withdrawalMethod, walletAddress, userId } = req.body;

    // Verify all required fields (redundant with validator, but kept for safety)
    const missingFields = [];
    if (!amount) missingFields.push('amount');
    if (!withdrawalMethod) missingFields.push('withdrawalMethod');
    if (!walletAddress) missingFields.push('walletAddress');
    if (!userId) missingFields.push('userId');

    if (missingFields.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Security check: ensure authenticated user matches requested userId
    if (req.user.id !== userId) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: Cannot create withdrawal for another user'
      });
    }

    // Retrieve user
    const user = await User.findByPk(userId, {
      attributes: ['id', 'walletBalance', 'totalRevenue', 'isVerified', 'email', 'totalWithdrawal'],
      transaction
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const { isVerified, walletBalance, totalRevenue, email, totalWithdrawal } = user;

    // Business rule validation
    if (amount < 2000) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Minimum withdrawal is $2,000'
      });
    }

    if (amount > walletBalance) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Insufficient wallet balance'
      });
    }

    if (!isVerified) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Withdrawal cannot be processed now. Please contact support to verify your account'
      });
    }

    if (totalRevenue < 3000) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Total revenue should be more than $3,000 before your withdrawal can be processed'
      });
    }

    // Create withdrawal record
    const withdrawal = await Withdrawal.create(
      {
        id: uuidv4(),
        amount,
        withdrawalMethod,
        walletAddress,
        transaction_id: generateTransactionId(),
        userId,
        status: 'pending',
        createdAt: new Date()
      },
      { transaction }
    );

    // Update user wallet balance
    await User.update(
      {
        walletBalance: walletBalance - amount,
        totalWithdrawal: (totalWithdrawal || 0) + amount
      },
      { where: { id: userId }, transaction }
    );

    // Send notification email
    try {
      await EmailTemplate.withdrawalEmail({
        email,
        amount: withdrawal.amount,
        asset: withdrawal.asset || 'USD', // Fallback if asset is undefined
        transactionId: withdrawal.transaction_id,
        status: withdrawal.status
      });
    } catch (emailError) {
      console.error('Failed to send withdrawal email:', emailError);
    }

    // Commit transaction
    await transaction.commit();

    // Return response matching frontend expectation
    return res.status(201).json({
      success: true,
      message: 'Withdrawal created successfully',
      transaction: withdrawal // Changed from data to transaction
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Withdrawal creation error:', error.message, error.stack);
    return sendErrorResponse(res, 500, 'Failed to create withdrawal', error);
  }
};

module.exports = { createWithdrawal };