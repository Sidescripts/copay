const { body, param } = require('express-validator');
const { Deposit, User } = require('../model');

const validateCreateDeposit = [
    body('amount')
        .isDecimal({ decimal_digits: '0,8' })
        .withMessage('Amount must be a decimal number')
        .custom((value) => {
            if (parseFloat(value) < 200) {
                throw new Error('Minimum deposit amount is 200');
            }
            return true;
        }),
    body('asset')
        .isIn(['BTC', 'ETH', 'USDT', 'LTC', 'BCH', 'BNB', 'DOGE', 'DASH'])
        .withMessage('Invalid deposit method')
    
];

const validateUpdateDeposit = [
    body('status')
        .optional()
        .isIn(['pending', 'confirmed', 'completed', 'failed'])
        .withMessage('Invalid status'),
    body('processed_at')
        .optional()
        .isISO8601()
        .withMessage('Processed at must be a valid date'),
    body('completed_at')
        .optional()
        .isISO8601()
        .withMessage('Completed at must be a valid date')
];

const validateUserIdParam = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .custom(async (value) => {
      const user = await User.findByPk(value);
      if (!user) {
        throw new Error('User not found');
      }
      return true;
    })
];

const validateDepositIdParam = [
  param('id')
    .notEmpty()
    .withMessage('Deposit ID is required')
    .custom(async (value) => {
      const deposit = await Deposit.findByPk(value);
      if (!deposit) {
        throw new Error('Deposit not found');
      }
      return true;
    })
];

module.exports = {
  validateCreateDeposit,
  validateUpdateDeposit,
  validateUserIdParam,
  validateDepositIdParam
};