const { body, param } = require('express-validator');

module.exports = {
  planValidation: [
    body('name')
        .notEmpty()
        .withMessage('Plan name is required'),
    body('min_amount')
        .isFloat({ min: 0.00000001 })
        .withMessage('Valid minimum amount required'),
    body('max_amount')
        .isFloat({ min: 0.00000001 })
        .withMessage('Valid maximum amount required'),
    body('duration_days')
        .isInt({ min: 1 })
        .withMessage('Valid duration required'),
    body('roi_percentage')
        .isFloat({ min: 0.01 })
        .withMessage('Valid ROI percentage required')
  ],

    planUpdateValidation: [
        param('plan_id')
            .isUUID()
            .withMessage('Valid plan ID required'),
        body('min_amount')
            .optional()
            .isFloat({ min: 0.00000001 }),
        body('max_amount')
            .optional()
            .isFloat({ min: 0.00000001 }),
        body('duration_days')
            .optional()
            .isInt({ min: 1 }),
        body('roi_percentage')
            .optional()
            .isFloat({ min: 0.01 })
    ],

    investmentValidation: [
        body('plan_id')
            .isUUID()
            .withMessage('Valid Plan ID is required'),
        body('amount')
            .isFloat({ min: 0.00000001 })
            .withMessage('Valid investment amount required')
    ]
};