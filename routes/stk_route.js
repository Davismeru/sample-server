const express = require("express");
const { stkController, stkPush } = require("../controllers/stk_controller");
const router = express.Router();

router.post("/stk", stkController, stkPush);

module.exports = router;
