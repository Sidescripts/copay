const express = require("express");
const {getCurrentUser, userDetails} = require("./dashboardController");
const AuthMiddleware = require("../../middlewares/userAuthMiddleware");
const {settingsValidation, changePasswordVal}= require("../../middlewares/settingsVal");
const {updatePassword, UpdateUserDetails} = require("./settingsController");
const router = express.Router();

router.route("/get-user").get(AuthMiddleware,userDetails);
router.get('/dashboard', AuthMiddleware,getCurrentUser);
router.post("/change-password", AuthMiddleware, changePasswordVal, updatePassword);
router.post("/update-details", AuthMiddleware, settingsValidation, UpdateUserDetails);

module.exports = router;