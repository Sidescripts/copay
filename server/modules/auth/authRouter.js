const express = require("express");
const router = express.Router();
const Register = require("./signupController");
const Login = require("./login");
const {requestResetValidation, resetPasswordValidation} = require("../../middlewares/passwordReset");
const passwordResetController = require("./resetPaswordController");

router.post("/signup", Register);
router.post("/login", Login);
// router.post('/forget-password', restPassword)
// router.post('/new-password', newPassword)
router.post(
    '/forget-password',
    requestResetValidation,
    passwordResetController.requestReset
);

// Verify reset token
router.get(
    '/verify',
    passwordResetController.verifyResetToken
);

// Reset password with token
router.post(
    '/new-password',
    resetPasswordValidation,
    passwordResetController.resetPassword
);



module.exports = router;
