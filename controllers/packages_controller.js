const packagesModel = require("../models/packages");
const packagesController = async (req, res) => {
  const packages = await packagesModel.find({}, { _id: 0 });
  res.json(packages);
};

module.exports = { packagesController };
