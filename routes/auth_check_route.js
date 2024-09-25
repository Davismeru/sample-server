const express = require("express");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router();

router.post("/checkAuth", checkAuth);

module.exports = router;
