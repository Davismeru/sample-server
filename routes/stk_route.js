const express = require("express");
const {
  stkController,
  stkPush,
  mpesaCallback,
} = require("../controllers/stk_controller");
const router = express.Router();

router.post("/stk", stkController, stkPush);
router.post("/mpesa/callback", mpesaCallback);

module.exports = router;
