const { validationResult } = require('express-validator');
const { Deposit, User, sequelize } = require('../../model');
const { use } = require('../../utils/nodemailer');

const manipulateBal = {
    addBal: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { username, asset, amount } = req.body;

            if (!username || !amount || !asset) {
                return res.status(400).json({
                    success: false,
                    message: "All values are required"
                });
            }

            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User does not exist"
                });
            }

            switch (asset.toUpperCase()) {
                case 'BTC':
                    user.btcBal = parseFloat(user.btcBal) + parseFloat(amount);
                    user.walletBalance = parseFloat(user.walletBalance) + parseFloat(amount); 
                    break;
                case 'ETH':
                    user.ethBal = parseFloat(user.ethBal) + parseFloat(amount);
                    user.walletBalance = parseFloat(user.walletBalance) + parseFloat(amount); 

                    break;
                case 'USDT':
                    user.usdtBal = parseFloat(user.usdtBal) + parseFloat(amount);
                    user.walletBalance = parseFloat(user.walletBalance) + parseFloat(amount); 

                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: "Not a valid asset"
                    });
            }

            await user.save();

            return res.status(200).json({
                success: true,
                message: "Balance added successfully",
                user: {
                    username: user.username,
                    btcBal: user.btcBal,
                    ethBal: user.ethBal,
                    usdtBal: user.usdtBal
                }
            });

        } catch (error) {
            console.error('Admin Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to process request'
            });
        }
    },

    subtractBal: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { username, asset, amount } = req.body;

            if (!username || !amount || !asset) {
                return res.status(400).json({
                    success: false,
                    message: "All values are required"
                });
            }

            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User does not exist"
                });
            }

            switch (asset.toUpperCase()) {
                case 'BTC':
                    if (parseFloat(user.btcBal) < parseFloat(amount)) {
                        return res.status(400).json({ success: false, message: "Insufficient BTC balance" });
                    }
                    user.btcBal = parseFloat(user.btcBal) - parseFloat(amount);
                    user.walletBalance = parseFloat(user.walletBalance) - parseFloat(amount); 

                    break;
                case 'ETH':
                    if (parseFloat(user.ethBal) < parseFloat(amount)) {
                        return res.status(400).json({ success: false, message: "Insufficient ETH balance" });
                    }
                    user.ethBal = parseFloat(user.ethBal) - parseFloat(amount);
                    user.walletBalance = parseFloat(user.walletBalance) - parseFloat(amount); 

                    break;
                case 'USDT':
                    if (parseFloat(user.usdtBal) < parseFloat(amount)) {
                        return res.status(400).json({ success: false, message: "Insufficient USDT balance" });
                    }
                    user.usdtBal = parseFloat(user.usdtBal) - parseFloat(amount);
                    user.walletBalance = parseFloat(user.walletBalance) - parseFloat(amount); 

                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: "Not a valid asset"
                    });
            }

            await user.save();

            return res.status(200).json({
                success: true,
                message: "Balance subtracted successfully",
                user: {
                    username: user.username,
                    btcBal: user.btcBal,
                    ethBal: user.ethBal,
                    usdtBal: user.usdtBal
                }
            });

        } catch (error) {
            console.error('Admin Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to process request'
            });
        }
    }
};

module.exports = manipulateBal;