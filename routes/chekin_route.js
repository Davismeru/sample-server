const express = require("express");
const router = express.Router();
const { checkinController } = require("../controllers/checkin_controller");

router.patch("/check_in", checkinController);

module.exports = router;
