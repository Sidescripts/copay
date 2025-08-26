const { body } = require('express-validator');

module.exports = {
  registerValidation: [
    body('username')
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
      .isAlphanumeric().withMessage('Username must be alphanumeric'),
    
    body('email')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail(),
    
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/\d/).withMessage('Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
    
    body('role')
      .optional()
      .isIn(['super_admin', 'admin', 'moderator']).withMessage('Invalid role')
  ],

  loginValidation: [
    body('email')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ]
};