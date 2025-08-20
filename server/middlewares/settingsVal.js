const { body } = require('express-validator');

module.exports = {
  settingsValidation: [
    body('state')
      .notEmpty()
      .withMessage('State is required')
      .isLength({ max: 100 })
      .withMessage('State must be less than 100 characters'),
    
    body('homeAddress')
      .notEmpty()
      .withMessage('Home address is required')
      .isLength({ min: 5, max: 255 })
      .withMessage('Address must be between 5-255 characters'),
    
    body('zip')
      .notEmpty()
      .withMessage('ZIP code is required')
      .matches(/^[a-z0-9\- ]+$/i)
      .withMessage('Invalid ZIP code format'),
    
    body('phoneNum')
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^\+?[\d\s\-()]+$/i)
      .withMessage('Invalid phone number format')
    
    ],
    changePasswordVal: [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),
    
        body('newPassword')
            .notEmpty()
            .withMessage('New password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters')
            .matches(/[A-Z]/)
            .withMessage('Password must contain at least one uppercase letter')
            .matches(/[a-z]/)
            .withMessage('Password must contain at least one lowercase letter')
            .matches(/\d/)
            .withMessage('Password must contain at least one number')
            .matches(/[!@#$%^&*(),.?":{}|<>]/)
            .withMessage('Password must contain at least one special character')
            .custom(function(value, { req }) {
                if (value === req.body.currentPassword) {
                    throw new Error('New password cannot be the same as current password');
                }
                return true;
            })
    ]
};
