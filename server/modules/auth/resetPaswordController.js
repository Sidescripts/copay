const { Op } = require('sequelize');
const { User } = require('../../model');
const {hashPassword} = require('../../utils/authUtils');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const emailService = require('./resetPasswordEmail'); // You'll need to create this

function PasswordResetController() {
  return {
    // Step 1: Request password reset (send email)
    requestReset: async function(req, res) {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
          // Return success even if email doesn't exist for security
          return res.json({ 
            success: true, 
            message: 'If the email exists, a reset link has been sent' 
          });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

        // Save token to user
        await user.update({
          resetToken,
          resetTokenExpiry
        });

        // Send email with reset link
        const resetLink = `${process.env.FRONTEND_URL}/pages/new-password.html?token=${resetToken}`;
        
        await emailService.sendPasswordResetEmail(email, resetLink);

        return res.json({ 
          success: true, 
          message: 'Password reset link sent to your email' 
        });

      } catch (error) {
        console.error('Password reset request error:', error);
        return res.status(500).json({ error: 'Failed to process reset request' });
      }
    },

    // Step 2: Verify reset token
    verifyResetToken: async function(req, res) {
      try {
        const { token } = req.query;

        if (!token) {
          return res.status(400).json({ error: 'Reset token is required' });
        }

        const user = await User.findOne({
          where: {
            resetToken: token,
            resetTokenExpiry: { [Op.gt]: new Date() } // Check if token is not expired
          }
        });

        if (!user) {
          return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        return res.json({ 
          success: true, 
          message: 'Token is valid' 
        });

      } catch (error) {
        console.error('Token verification error:', error);
        return res.status(500).json({ error: 'Failed to verify token' });
      }
    },

    // Step 3: Reset password with token
    resetPassword: async function(req, res) {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { token, newPassword } = req.body;
        console.log(req.body);

        // Find user with valid token
        const user = await User.findOne({
          where: {
            resetToken: token,
            resetTokenExpiry: { [Op.gt]: new Date() }
          }
        });

        if (!user) {
          return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password and clear reset token
        await user.update({
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null
        });

        return res.json({ 
          success: true, 
          message: 'Password reset successfully' 
        });

      } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({ error: 'Failed to reset password' });
      }
    }
  };
}

module.exports = PasswordResetController();
