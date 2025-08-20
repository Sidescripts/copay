const { User } = require('../../model');


async function getCurrentUser(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
}


module.exports = getCurrentUser;