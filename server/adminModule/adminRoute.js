const express = require("express");
const router = express.Router();
const {registerValidation, loginValidation} =  require("../middlewares/adminVal");
const {AuthMid} = require("../middlewares/adminMiddleware");
const {validateUpdateDeposit} = require("../middlewares/depositVal");
const {planUpdateValidation,planValidation} = require("../middlewares/investmentVal");
// const {approveWithdrawalValidation} = require("../middlewares/withdrawalVal");
const AdminAuthController = require("./adminAuthModule/adminAuth");
const adminUserController = require("./adminAuthModule/adminUserController");
const adminDashboardController = require("./adminAuthModule/adminDashboard");
const adminDepositController = require("./depositAdminModule/adminDepositController");
const AdminInvestmentController = require("./investAdminModule/adminInvestController");
const adminWithdrawalController = require("./WithdrawalAdminModule/adminWthController");

// ADMIN AUTH ROUTE
router.post('/signup', registerValidation, AdminAuthController().register);
router.post('/login', loginValidation, AdminAuthController().login);
// router.get('/profile', AdminAuthMiddleware, AdminMiddleware,AdminAuthController().getAdminProfile);
// router.get('all-admin', AdminAuthMiddleware, AdminMiddleware, AdminAuthController().getAllAdmins);

// // ADMIN DASHBOARD AND USER ROUTE
router.get('/users', AuthMid, adminUserController.getAllUsers)
router.get('/users/details', AuthMid,adminUserController.getUserDetails)
router.post('/users/:userId/verify', AuthMid,adminUserController.verifyUser)
router.patch('/users/:userId/withdrawal', AuthMid, adminUserController.updateTotalWithdrawal)
router.patch('/users/:userId/balance', AuthMid, adminUserController.updateWalletBalance)
router.get('/dashboard/stats', AuthMid, adminDashboardController.getDashboardStats)
router.get('/dashboard/pending-actions', AuthMid, adminDashboardController.getPendingActions)

// ADMIN DEPOSIT ROUTE
router.get('/deposit/all-deposit',  AuthMid,  adminDepositController.getAllDeposits)
router.patch('/deposit/:depositId', AuthMid,validateUpdateDeposit,adminDepositController.adminProcessDeposit)
router.get('/deposit/stat', adminDepositController.getDepositStats)

// // ADMIN INVESTMENT ROUTE
router.get('/invest/all', AuthMid, AdminInvestmentController.findAllPlan);
router.post('/invest/create-plan', AuthMid, planValidation,AdminInvestmentController.createPlan);
router.patch('/invest/update/:planId', AuthMid, planUpdateValidation,AdminInvestmentController.updatePlan);
router.patch('/invest/deactivate/:planId', AuthMid, AdminInvestmentController.deactivatePlan);
router.delete('/invest/delete/:planId', AuthMid, AdminInvestmentController.deletePlan);
//all investment and manual ROI
router.get("/investment/all", AuthMid, AdminInvestmentController.getAllInvestments)
router.patch('/investment/update/:id',AuthMid, AdminInvestmentController.manualROIPayout);

// // ADMIN WITHDRAWAL ROUTE
router.get('/withdrawal', AuthMid, adminWithdrawalController.getAllWithdrawals);
router.get('/withdrawal-stat',  AuthMid, adminWithdrawalController.getWithdrawalStats);
router.patch('/withdrawal/:id', AuthMid, adminWithdrawalController.updateWithdrawalStatus);

module.exports = router;