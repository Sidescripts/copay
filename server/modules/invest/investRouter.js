const express = require("express");
const AuthMiddleware = require("../../middlewares/userAuthMiddleware");
const InvestmentController = require("./investController");
const AdminInvestmentController = require("../../adminModule/investAdminModule/adminInvestController");
const router = express.Router();

// getInvestment plan
router.get("/plans", AuthMiddleware, AdminInvestmentController.getInvestmentPlans);

// createInvestment
router.post("/invest-now", AuthMiddleware, InvestmentController().createInvestment);

// allInvestment
router.get("/invest-history", AuthMiddleware, InvestmentController().getUserInvestments);

// oneInvestment
router.get("/:id", AuthMiddleware, InvestmentController().getSingleInvestment);


module.exports = router;