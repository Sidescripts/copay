require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const { Sequelize } = require('sequelize');
const {startROICron} = require("./modules/invest/cronjobInvestment");
const {sequelize,connectDB} = require("./config/db");
const errorHandler = require("./errors/errorHandler");
const logger = require("./utils/logger");
const userRoute = require("./modules/dashboardModule/dashboardRouter");
const authRoute = require("./modules/auth/authRouter");
const depositRoute = require("./modules/depositModule/depositRouter");
const withdrawalRoute = require("./modules/withdrawal/withdrawalRouter");
const investRoute = require("./modules/invest/investRouter");
const adminRoutes = require("./adminModule/adminRoute");
const path = require('path');
const app = express();


// config
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', true);

//routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/deposit', depositRoute);
app.use('/api/v1/withdrawal', withdrawalRoute);
app.use('/api/v1/invest', investRoute);
// Admin base route
app.use("/api/v1/admin", adminRoutes);


// Basic route example
app.get("/health", async (req, res) => {
    try {
        await sequelize.authenticate();
        console.log(req.ip)
        res.json({
          status: 'UP',
          database: 'CONNECTED',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({
          status: 'DOWN',
          database: 'DISCONNECTED',
          error: error.message
        });
      }
});

// error
app.use(errorHandler)


const startServer = async () => {
    const port = process.env.PORT || 2000;
    try {
        await connectDB();
        
        startROICron();
        logger.info('✅ ROI cron job started');

        app.listen(port, () => {
            logger.info(`Server running on http://localhost:${port}`);
            logger.info('⏰ ROI auto-payouts scheduled every 12 hours');
          });
    } catch (error) {
        logger.error('Failed to start application:', error);
        console.error(error);
        process.exit(1); // Exit the process with a failure code
    }
};
startServer();

function gracefulShutdown(){
  console.log('Starting graceful shutdown...');

  Server.close(() =>{
    console.log('Server stopped!!')
  });

  sequelize.close().then(() =>{
    console.log("Database connections closed");
    process.exit(0);
  }).catch(err =>{
    console.error('Error closing database: ', err);
    process.exit(1);
  });

  setTimeout(() =>{
    console.log('Forcing shutdown after timeout')
    process.exit(1);
  }, 10000);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

