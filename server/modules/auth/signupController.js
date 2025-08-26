const { User } = require('../../model');
const {hashPassword, generateToken} = require('../../utils/authUtils');
const { validationResult } = require('express-validator');
const EmailService = require("./welcomeEmail");

async function Register (req,res) {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password, username, fullname, country } = req.body;

    if(!email || !password || !username || !fullname || !country){
      return res.status(400).json({erorr: 'Field(s) cannot be empty'})
    }

    const loginLink = `${process.env.FRONTEND_URL}/public/pages/login.html`;


    // check if username already exist
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      fullname,
      country,
      isVerified: false
    });

    // Generate token
    const token = generateToken(user);

    // Prepare response
    const userResponse = user.toJSON();
    delete userResponse.password;

    await EmailService.welcomeEmail({
      email: email, 
      username:username,
      loginLink: loginLink
    });
    return res.status(201).json({
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
}

module.exports = Register;