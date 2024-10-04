const axios = require("axios");
const stkController = async (req, res, next) => {
  const key = "qLSAIv63R102NSOUkz4h4hW0HG1WFHF4Fof7gJnkXsxmQmGJ";
  const secret =
    "cLX87avk7m8SNPG7H0XPqw4ep8U78Rx5DQagbIlXFIIfSaAJficNka7jZw6DORP9";
  const auth = new Buffer.from(`${key}:${secret}`).toString("base64");
  await axios
    .get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    )
    .then((data) => {
      token = data.data.access_token;
      console.log(data.data);
    })
    .catch((err) => console.log("error generating token"));
  next();
};

const stkPush = async (req, res) => {
  const { phone_no, price } = req.body;
  const shortCode = 174379;
  const phone = "717214046";
  const amount = 10;
  const passkey =
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);
  const password = new Buffer.from(shortCode + passkey + timestamp).toString(
    "base64"
  );
  const data = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: `254${phone}`,
    PartyB: "174379",
    PhoneNumber: `254${phone}`,
    CallBackURL: "https://mydomain.com/pat",
    AccountReference: "Test",
    TransactionDesc: "Test",
  };

  await axios
    .post(url, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      res.send("success generating stk");
    })
    .catch((err) => res.send("error generating stk"));
};

module.exports = { stkController, stkPush };
