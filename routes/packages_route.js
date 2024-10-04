const express = require("express");
const router = express.Router();
const { packagesController } = require("../controllers/packages_controller");

router.get("/packages", packagesController);

module.exports = router;
