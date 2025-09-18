const express = require("express");
const AuthMiddleware = require("../../middlewares/userAuthMiddleware");
const {validateCreateDeposit, validateUserIdParam, validateDepositIdParam}= require("../../middlewares/depositVal");
const userDepositController = require("./depositController");
const router = express.Router();

router.get('/deposit-history', AuthMiddleware, validateUserIdParam,userDepositController.getUserDeposits);
router.post("/deposit", AuthMiddleware, userDepositController.createDeposit);
router.get("/deposit/:id", AuthMiddleware, validateDepositIdParam, userDepositController.getDeposit);

module.exports = router;