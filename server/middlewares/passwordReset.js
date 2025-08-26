const { body } = require('express-validator');

module.exports = {
  requestResetValidation: [
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail()
  ],

  resetPasswordValidation: [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
  ]
};