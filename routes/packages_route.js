const express = require("express");
const router = express.Router();
const packagesModel = require("../models/packages");

router.get("/packages", async (req, res) => {
  const packages = await packagesModel.find({}, { _id: 0 });
  res.json(packages);
});

module.exports = router;
