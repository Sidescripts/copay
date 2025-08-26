const tokenUtil = require('../utils/authUtils');
const { Admin } = require('../model');

function AdminAuthMiddleware() {
  return {
    authenticate: async function(req, res, next) {
      try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'Admin authentication required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = tokenUtil.verifyToken(token);

        // Verify the user is actually an admin
        const admin = await Admin.findByPk(decoded.id);
        if (!admin || !admin.is_active) {
          return res.status(401).json({ error: 'Invalid admin token' });
        }

        // Attach admin to request
        req.admin = {
          AdminId: admin.id,
          username: admin.username,
          role: admin.role
        };

        next();
      } catch (error) {
        console.error('Admin auth error:', error);
        
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Admin token expired' });
        }
        
        return res.status(401).json({ error: 'Invalid admin token' });
      }
    }
  };
}

function AdminMiddleware() {
    return {
      // Middleware to check if user is admin
      requireAdmin: function(req, res, next) {
        
        try {
          if (!req.admin || req.admin.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
          }
          next();  
        } catch (error) {
          res.status(500).json({error: "Admin check failed!!"})
        }
        
        
      },

      // Middleware to check if user is super admin
      requireSuperAdmin: function(req, res, next) {
        try {
          if (!req.admin || req.admin.role !== 'super_admin') {
            return res.status(403).json({ error: 'Super admin access required' });
          }
          next();  
        } catch (error) {
          res.status(500).json({error: "Admin check failed!!"})
        }
        
      }
    };
}
  
module.exports = {AdminAuthMiddleware, AdminMiddleware};
