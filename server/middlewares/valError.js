function ErrorHandler() {
    return {
      handle: function(err, req, res, next) {
        console.error(err.stack);
        
        if (err.name === 'ValidationError') {
          return res.status(400).json({ 
            error: 'Validation error',
            details: err.errors 
          });
        }
  
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expired' });
        }
  
        return res.status(500).json({ error: 'Something went wrong' });
      }
    };
  }
  
module.exports = ErrorHandler().handle;

