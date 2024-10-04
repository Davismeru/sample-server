const express = require("express");
const { signinController } = require("../controllers/signin_controller");
const router = express.Router();

router.post("/sign_in", signinController);

module.exports = router;
