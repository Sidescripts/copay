const {User} = require("../../model");
const { validationResult } = require('express-validator');
const {comparePassword, hashPassword} = require('../../utils/authUtils');


async function UpdateUserDetails(req,res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { state, homeAddress, zip, phoneNum } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Update user details
        const updatedUser = await user.update({
          state,
          homeAddress,
          zip,
          phoneNum
        });

        // Remove password from response
        const userResponse = updatedUser.toJSON();
        delete userResponse.password;

        return res.json({
          message: 'User details updated successfully',
          user: userResponse,
        });

    } catch (error) {
        console.error('user update error:', error);
        return res.status(500).json({ error: 'Failed to complete user update' });
    }
}


async function updatePassword(req,res) {
  
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Find user
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isCurrentPasswordValid = await comparePassword(
          currentPassword, 
          user.password
        );

        if (!isCurrentPasswordValid) {
          return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedNewPassword = await hashPassword(newPassword);

        // Update password
        await user.update({
          password: hashedNewPassword
        });

        return res.json({
          success: true,
          message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({ error: 'Failed to change password' });
    }
}


module.exports = {UpdateUserDetails, updatePassword};