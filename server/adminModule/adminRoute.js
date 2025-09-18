const express = require("express");
const router = express.Router();
const {registerValidation, loginValidation} =  require("../middlewares/adminVal");
const {AdminAuthMiddleware, AdminMiddleware} = require("../middlewares/adminMiddleware");
const {validateUpdateDeposit} = require("../middlewares/depositVal");
const {planUpdateValidation,planValidation} = require("../middlewares/investmentVal");
const {approveWithdrawalValidation} = require("../middlewares/withdrawalVal");
const AdminAuthController = require("./adminAuthModule/adminAuth");
const adminUserController = require("./adminAuthModule/adminUserController");
const adminDashboardController = require("./adminAuthModule/adminDashboard");
const adminDepositController = require("./depositAdminModule/adminDepositController");
const AdminInvestmentController = require("./investAdminModule/adminInvestController");
const adminWithdrawalController = require("./WithdrawalAdminModule/adminWthController");

// ADMIN AUTH ROUTE
router.post('/signup', registerValidation, AdminAuthController().register);
router.post('/login', loginValidation, AdminAuthController().login);
router.get('/profile', AdminAuthMiddleware, AdminMiddleware,AdminAuthController().getAdminProfile);
router.get('all-admin', AdminAuthMiddleware, AdminMiddleware, AdminAuthController().getAllAdmins);

// ADMIN DASHBOARD AND USER ROUTE
router.get('/users', AdminAuthMiddleware, AdminMiddleware, adminUserController.getAllUsers)
router.get('/users/details', AdminAuthMiddleware, AdminMiddleware, adminUserController.getUserDetails)
router.post('/users/:userId/verify', AdminAuthMiddleware, AdminMiddleware, adminUserController.verifyUser)
router.patch('/users/:userId/withdrawal', AdminAuthMiddleware, AdminMiddleware, adminUserController.updateTotalWithdrawal)
router.patch('/users/:userId/balance', AdminAuthMiddleware, AdminMiddleware, adminUserController.updateWalletBalance)
router.get('/dashboard/stats', AdminAuthMiddleware, AdminMiddleware, adminDashboardController.getDashboardStats)
router.get('/dashboard/pending-actions', AdminAuthMiddleware, AdminMiddleware, adminDashboardController.getPendingActions)

// ADMIN DEPOSIT ROUTE
router.get('/deposit/all-deposit', AdminAuthMiddleware, AdminMiddleware, adminDepositController.getAllDeposits)
router.patch('/deposit/:userId', AdminAuthMiddleware, AdminMiddleware, validateUpdateDeposit,adminDepositController.adminProcessDeposit)
router.get('/deposit/stat', AdminAuthMiddleware, AdminMiddleware, adminDepositController.getDepositStats)

// ADMIN INVESTMENT ROUTE
router.post('/invest/create-plan', AdminAuthMiddleware, AdminMiddleware, planValidation,AdminInvestmentController.createPlan);
router.get('/invest/all', AdminAuthMiddleware, AdminMiddleware, AdminInvestmentController.findAllPlan);
router.patch('/invest/update/:id', AdminAuthMiddleware, AdminMiddleware, planUpdateValidation,AdminInvestmentController.updatePlan);
router.patch('/invest/deactivate/:id', AdminAuthMiddleware, AdminMiddleware, AdminInvestmentController.deactivatePlan);
router.delete('/invest/delete/:id', AdminAuthMiddleware, AdminMiddleware, AdminInvestmentController.deletePlan);
router.patch('/investment/update/:id', AdminAuthMiddleware, AdminMiddleware, AdminInvestmentController.manualROIPayout);

// ADMIN WITHDRAWAL ROUTE
router.get('/withdrawal', AdminAuthMiddleware, AdminMiddleware, adminWithdrawalController.getAllWithdrawals);
router.get('/withdrawal-stat', AdminAuthMiddleware, AdminMiddleware, adminWithdrawalController.getWithdrawalStats);
router.patch('/withdrawal/:id', AdminAuthMiddleware, AdminMiddleware, adminWithdrawalController.updateWithdrawalStatus);

module.exports = router;