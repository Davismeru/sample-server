const express = require("express");
const {
  signupController,
  otpController,
} = require("../controllers/signup_controller");
const router = express.Router();

router.post("/sign_up", signupController);

// generate unique otp
router.post("/verify_otp", otpController);

module.exports = router;
