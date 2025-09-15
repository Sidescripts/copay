const { body, param } = require('express-validator');

const createWithdrawalValidation = [
    // body('userId').notEmpty().withMessage('User ID is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('withdrawalMethod').notEmpty().withMessage('Withdrawal method is required'),
    body('walletAddress').notEmpty().withMessage('Wallet address is required')
];

const userWithdrawalsValidation = [
    param('userId')
        .isUUID()
        .withMessage('Invalid user ID'),
];

const withdrawalIdValidation = [
    param('id')
        .isUUID()
        .withMessage('Invalid withdrawal ID'),
];

const approveWithdrawalValidation = [
    param('id')
        .isUUID()
        .withMessage('Invalid withdrawal ID'),
    body('status')
        .isIn(['confirmed', 'completed', 'failed'])
        .withMessage('Invalid status'),
];

module.exports = {
    createWithdrawalValidation,
    userWithdrawalsValidation,
    withdrawalIdValidation,
    approveWithdrawalValidation,
};