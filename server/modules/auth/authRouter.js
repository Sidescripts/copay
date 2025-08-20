const express = require("express");
const router = express.Router();
const Register = require("./signupController");
const Login = require("./login");

router.post("/signup", Register);
router.post("/login", Login);


module.exports = router;