const express = require("express");
const AuthMiddleware = require("../../middlewares/userAuthMiddleware");
const {createWithdrawalValidation, userWithdrawalsValidation, withdrawalIdValidation}= require("../../middlewares/withdrawalVal");
const userWithdrawalController = require("./withdrawalController");
const router = express.Router();

router.get('/withdrawal-history', AuthMiddleware, userWithdrawalController.getUserWithdrawals);
router.post("/withdrawal", AuthMiddleware, createWithdrawalValidation, userWithdrawalController.createWithdrawal);
router.get("/withdrawal/:id", AuthMiddleware, withdrawalIdValidation,userWithdrawalController.getWithdrawal);

module.exports = router;