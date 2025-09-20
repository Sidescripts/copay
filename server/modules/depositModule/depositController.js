const { validationResult } = require('express-validator');
const { Deposit, User } = require('../../model');
const { v4: uuidv4 } = require('uuid');
const generateTransactionId = require("../../utils/transactionIdUtils");
const EmailTemplate = require("./depositEmail");

// Utility to handle validation errors
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
        });
    }
    return null;
};

// Standard error response
const sendErrorResponse = (res, status, message, error) => {
    console.error(`${message}:`, error);
    return res.status(status).json({
        success: false,
        message,
    });
};

const userDepositController = {
  // Create a new deposit
  createDeposit: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      const userId = req.user.id
      const email = req.user.email
      const { amount, asset} = req.body;
      
      console.log(req.body)
      const deposit = await Deposit.create({
        id: uuidv4(),
        amount,
        asset,
        transaction_id: generateTransactionId(),
        userId,
        status: 'pending'
      });

      await EmailTemplate.depositEmail({
        email:email,
        username: req.user.username,
        amount: deposit.amount,
        asset:deposit.asset,
        trxnId: deposit.transaction_id,
        status:deposit.status
      });
      
      res.status(201).json({
        success: true,
        message: 'Deposit created successfully',
        data: deposit
      });
    } catch (error) {
      console.error('Create deposit error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

    getUserDeposits: async (req, res) => {
        const validationError = handleValidationErrors(req);
        if (validationError) return validationError;

        const { userId } = req.params;

        try {
            const deposits = await Deposit.findAll({
                where: { userId },
                attributes: ['id', 'transaction_id', 'amount', 'asset', 'status', 'createdAt'],
                order: [['createdAt', 'DESC']],
            });

            return res.status(200).json({
                success: true,
                message: deposits.length ? 'Deposit history retrieved successfully' : 'No deposits found',
                data: deposits,
            });
        } catch (error) {
            return sendErrorResponse(res, 500, 'Failed to retrieve deposit history', error);
        }
    },


   // Get a specific deposit by ID
   getDeposit: async (req, res) => {
    const validationError = handleValidationErrors(req);
    if (validationError) return validationError;

    const { id } = req.params;

    try {
        const deposit = await Deposit.findByPk(id, {
            attributes: ['id', 'transaction_id', 'amount', 'asset', 'status', 'createdAt', 'userId'],
        });

        if (!deposit) {
            return res.status(404).json({
                success: false,
                message: 'Deposit not found',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Deposit retrieved successfully',
            data: deposit,
        });
    } catch (error) {
        return sendErrorResponse(res, 500, 'Failed to retrieve deposit', error);
    }
}
};

module.exports = userDepositController;