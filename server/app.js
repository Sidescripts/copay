require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const { Sequelize } = require('sequelize');
const {sequelize,connectDB} = require("./config/db");
const errorHandler = require("./errors/errorHandler");
const logger = require("./utils/logger");
const userRoute = require("./modules/dashboardModule/dashboardRouter");
const authRoute = require("./modules/auth/authRouter");
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
        // await ensureDatabase();
        app.listen(port, () => {
            logger.info(`Server running on http://localhost:${port}`);
            // console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        logger.error('Failed to start application:', error);
        // console.error("Failed to start the server:", error);
        process.exit(1); // Exit the process with a failure code
    }
};

startServer();

