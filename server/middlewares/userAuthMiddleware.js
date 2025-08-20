const tokenUtil = require('../utils/authUtils');
const { User } = require('../model');


async function AuthMiddleware(req,res,next){
    try {
      const authHeader = req.header('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = tokenUtil.verifyToken(token);

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user;


      next();
    } catch (error) {
      console.error('Authentication error:', error);
        
      if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expired' });
      }
        
      return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = AuthMiddleware;