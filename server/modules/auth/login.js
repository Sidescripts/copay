const {generateToken,comparePassword} = require('../../utils/authUtils');
const { User } = require('../../model');
const { validationResult } = require('express-validator');

async function Login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user);

      // Prepare response
      const userResponse = user.toJSON();
      delete userResponse.password;

      return res.json({
        user: userResponse,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Login failed' });
    }
}


module.exports = Login;