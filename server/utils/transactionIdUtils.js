const crypto = require('crypto');
const random = crypto.randomInt(10000, 99999); // 5-digit random

const generateTransactionId = () => {
    // Get timestamp components for uniqueness
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
    return `Dtxn_${timestamp}${random}`; // e.g., txn_2025082113412312345
};

module.exports = generateTransactionId;