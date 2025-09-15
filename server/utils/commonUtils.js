// utils/common.js
const { validationResult } = require('express-validator');

function handleValidationErrors(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
}

// Standard error response
const sendErrorResponse = (res, status, message, error) => {
    console.error(`${message}:`, error);
    return res.status(status).json({
        success: false,
        message,
    });
};

// Generate custom transaction_id
const generateTransactionId = () => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
    const random = Math.floor(10000 + Math.random() * 90000); // 5-digit random
    return `txn_${timestamp}${random}`; // e.g., txn_2025082117082312345
};

module.exports = {
    handleValidationErrors,
    sendErrorResponse,
    generateTransactionId
};