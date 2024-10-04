const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usersModel = require("../models/users");

const signinController = async (req, res) => {
  const { phone_no, password } = req.body;
  const checkUser = await usersModel.findOne({ phone_no: phone_no });
  if (!checkUser) {
    res.json({ error: "This number is not registered" });
    console.log(phone_no);
  } else {
    bcrypt.compare(password, checkUser.password).then(function (result) {
      if (!result) {
        res.json({ error: "Incorrect password" });
      } else {
        const token = jwt.sign(
          {
            username: checkUser.username,
            phone_no: checkUser.phone_no,
            balance: checkUser.balance,
          },
          "shhhhh"
        );
        res.send(token);
      }
    });
  }
};
module.exports = { signinController };
