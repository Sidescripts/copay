const { User, Investment, Sequelize } = require('../../model');
const { Op } = require('sequelize');

async function getCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: [
          'password',
          'fullname',
          'username',
          'country',
          'state',
          'homeAddress',
          'zip',
          'phoneNum',
          'resetToken',
          'resetTokenExpiry',
          'isVerified',
        ] }
      });
      if(!user){
        return res.status(404).json({ error: 'User not found' });
      }

      // Calculate active investments amount
      const activeInvestments = await Investment.sum('amount', {
        where: { 
          userId: userId,
          status: 'active'
        }
      });

      const userResponse = user.toJson();
      userResponse.dashboard = {
        walletBalance: user.walletBalance || 0,
        totalRevenue: parseFloat(user.totalRevenue || 0),
        totalWithdrawal: parseFloat(user.totalWithdrawal || 0),
        activeInvestments: parseFloat(activeInvestments || 0),
        btcBal: parseFloat(user.btcBal || 0),
        ethBal: parseFloat(user.ethBal || 0),
        ltcBal: parseFloat(user.ltcBal || 0),
        usdtBal: parseFloat(user.usdtBal || 0),
        bchBal: parseFloat(user.bchBal || 0),
        dashBal: parseFloat(user.dashBal || 0),
        bnbBal: parseFloat(user.bnbBal || 0),
        dogeBal: parseFloat(user.dogeBal || 0),
      }

      return res.status(200).json(user);
    } catch (error) {
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
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
}


module.exports = {getCurrentUser, userDetails};