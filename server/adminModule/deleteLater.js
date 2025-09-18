// vt/server/app.js
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const app = express();

// CSP Configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://www.smartsuppchat.com",
          "https://*.smartsuppcdn.com"
        ],
        scriptSrcAttr: ["'none'"],
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://*.smartsuppcdn.com",
          "https://fonts.googleapis.com"
        ],
        fontSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com",
          "https://*.smartsuppcdn.com",
          "https://fonts.gstatic.com",
          "data:"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://*.smartsupp.com",
          "https://*.smartsuppcdn.com",
          "https://app.ciqpay.com",
          "https://cdn.pixabay.com"
        ],
        mediaSrc: [
          "'self'", // Allow media from vitron-trade.com
          "https://*.smartsuppcdn.com"
        ],
        connectSrc: [
          "'self'",
          "https://bootstrap.smartsuppchat.com",
          "https://*.smartsupp.com",
          "https://*.smartsuppchat.com",
          "https://*.smartsuppcdn.com",
          "wss://*.smartsupp.com",
          "wss://websocket-visitors.smartsupp.com", // Explicitly allow Smartsupp WebSocket
          "https://api.coingecko.com"
        ],
        frameSrc: [
          "https://*.smartsupp.com",
          "https://*.smartsuppcdn.com"
        ]
      }
    }
  })
);

// Middleware to ensure correct MIME types
app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  if (req.url.endsWith('.mp4')) {
    res.setHeader('Content-Type', 'video/mp4');
  }
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/v1/withdrawal', require('./routes/withdrawal'));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Catch-all for 404
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));