const usersModel = require("../models/users");

// bcrypt
const bcrypt = require("bcryptjs");
const saltRounds = 10;

// Your AccountSID and Auth Token from console.twilio.com
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NO;

const client = require("twilio")(accountSid, authToken);
const signupController = async (req, res) => {
  const { username, phone_no, password } = req.body;

  // confirm if number is already registered
  const confirmNumber = await usersModel.findOne({ phone_no: phone_no });
  if (confirmNumber) {
    res.json({ error: "Number already registered" });
  } else {
    res.send("success");
  }
};

// generate otp
const unique_code = Math.floor(1000 + Math.random() * 10000);
const otpController = async (req, res) => {
  const { username, password, phone_no, otp } = req.body;
  // if no otp (initial call when client loads) send otp
  if (!otp) {
    client.messages
      .create({
        body: `Your OTP is ${unique_code}`,
        from: twilioNumber,
        to: phone_no,
      })
      .then(() => {
        res.json({ success: "OTP sent" });
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    //if otp exists, check if it matches
    if (otp != unique_code) {
      res.json({ error: "Incorrect verification code" });
    } else {
      // hash password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // save user to database
      usersModel
        .create({
          username,
          phone_no,
          password: hashedPassword,
        })
        .then(() => {
          res.json({ success: "User registered" });
        })
        .catch(() => {
          res.json({ error: "User not registered" });
        });
    }
  }
};
module.exports = { signupController, otpController };
