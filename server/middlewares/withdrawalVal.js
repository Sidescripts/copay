const { body, param } = require('express-validator');

const createWithdrawalValidation = [
    body('amount')
        .isDecimal({ decimal_digits: '0,8' })
        .custom((value) => {
            if (parseFloat(value) < 1000) {
                throw new Error('Amount must be at least 1000.00');
            }
            return true;
        }),
    body('withdrawalMethod')
        .isIn(['BTC', 'ETH', 'USDT', 'LTC', 'BCH', 'BNB', 'DOGE', 'DASH'])
        .withMessage('Invalid withdrawal method'),
    body('walletAddress')
        .notEmpty()
        .withMessage('Wallet address is required')
        .isString()
        .withMessage('Wallet address must be a string'),
    body('userId')
        .isUUID()
        .withMessage('Invalid user ID'),
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