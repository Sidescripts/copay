const { User, Investment, Sequelize } = require('../../model');

async function getCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId, {
        attributes: { 
          exclude: [
            'password',
            'fullname',
            'country',
            'state',
            'homeAddress',
            'zip',
            'phoneNum',
            'resetToken',
            'resetTokenExpiry',
            'isVerified',
          ]
        }
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Calculate active investments amount
      const activeInvestments = await Investment.sum('amount', {
        where: { 
          userId: userId,
          status: 'active'
        }
      });

      // Calculate total revenue from completed investments
      const totalRevenue = await Investment.sum('actual_roi', {
        where: { 
          userId: userId,
          status: 'completed'
        }
      });

      // Update totalRevenue, defaulting to 0.0 if null
      await User.update(
        { totalRevenue: totalRevenue || 0.0 },
        { where: { id: userId } }
      );

      return res.status(200).json({
        success: true,
        username: user.username,
        walletBalance: parseFloat(user.walletBalance || 0),
        totalRevenue: parseFloat(totalRevenue || 0),
        totalWithdrawal: parseFloat(user.totalWithdrawal || 0),
        activeInvestments: parseFloat(activeInvestments || 0),
        revenue: parseFloat(user.revenue || 0),
        btcBal: parseFloat(user.btcBal || 0),
        ethBal: parseFloat(user.ethBal || 0),
        ltcBal: parseFloat(user.ltcBal || 0),
        usdtBal: parseFloat(user.usdtBal || 0),
        bchBal: parseFloat(user.bchBal || 0),
        dashBal: parseFloat(user.dashBal || 0),
        bnbBal: parseFloat(user.bnbBal || 0),
        dogeBal: parseFloat(user.dogeBal || 0),
      });
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
}

async function userDetails(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    return res.status(200).json({
      msg: "User details",
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      country: user.country,
      state: user.state,
      homeAddress: user.homeAddress,
      zip: user.zip,
      phoneNum: user.phoneNum
    });
  } catch (error) {
    console.error('Error in userDetails:', error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
}

module.exports = { getCurrentUser, userDetails };