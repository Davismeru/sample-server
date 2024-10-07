// const axios = require("axios");
// const stkController = async (req, res, next) => {
//   const key = "qLSAIv63R102NSOUkz4h4hW0HG1WFHF4Fof7gJnkXsxmQmGJ";
//   const secret =
//     "cLX87avk7m8SNPG7H0XPqw4ep8U78Rx5DQagbIlXFIIfSaAJficNka7jZw6DORP9";
//   const auth = new Buffer.from(`${key}:${secret}`).toString("base64");
//   await axios
//     .get(
//       "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
//       {
//         headers: {
//           authorization: `Basic ${auth}`,
//         },
//       }
//     )
//     .then((data) => {
//       token = data.data.access_token;
//       console.log(data.data);
//     })
//     .catch((err) => console.log("error generating token"));
//   next();
// };

// const stkPush = async (req, res) => {
//   const { phone_no, price } = req.body;
//   const shortCode = 174379;
//   const phone = phone_no;
//   const amount = price;
//   const passkey =
//     "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
//   const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

//   const date = new Date();
//   const timestamp =
//     date.getFullYear() +
//     ("0" + (date.getMonth() + 1)).slice(-2) +
//     ("0" + date.getDate()).slice(-2) +
//     ("0" + date.getHours()).slice(-2) +
//     ("0" + date.getMinutes()).slice(-2) +
//     ("0" + date.getSeconds()).slice(-2);
//   const password = new Buffer.from(shortCode + passkey + timestamp).toString(
//     "base64"
//   );
//   const data = {
//     BusinessShortCode: shortCode,
//     Password: password,
//     Timestamp: timestamp,
//     TransactionType: "CustomerPayBillOnline",
//     Amount: amount,
//     PartyA: `254${phone}`,
//     PartyB: "174379",
//     PhoneNumber: `254${phone}`,
//     CallBackURL: "https://mydomain.com/pat",
//     AccountReference: "Test",
//     TransactionDesc: "Test",
//   };

//   await axios
//     .post(url, data, {
//       headers: {
//         authorization: `Bearer ${token}`,
//       },
//     })
//     .then((response) => {
//       res.json(response.data);
//     })
//     .catch((err) => res.send("error generating stk"));
// };

// module.exports = { stkController, stkPush };
const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Middleware to parse incoming JSON payloads
app.use(bodyParser.json());

let token = ""; // Variable to store the access token

// Controller to generate OAuth token from Daraja API
const stkController = async (req, res, next) => {
  const key = "qLSAIv63R102NSOUkz4h4hW0HG1WFHF4Fof7gJnkXsxmQmGJ";
  const secret =
    "cLX87avk7m8SNPG7H0XPqw4ep8U78Rx5DQagbIlXFIIfSaAJficNka7jZw6DORP9";
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");

  try {
    // Request to generate access token
    const { data } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    );
    token = data.access_token; // Store the access token in a variable
    console.log("Generated Access Token:", token);
    next(); // Proceed to the next middleware
  } catch (err) {
    console.error("Error generating token:", err);
    res.status(500).send("Error generating token");
  }
};

// Controller to initiate the STK Push request
const stkPush = async (req, res) => {
  const { phone_no, price } = req.body; // Get phone number and price from request body
  const shortCode = 174379;
  const phone = phone_no;
  const amount = price;
  const passkey =
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"; // Daraja sandbox passkey
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  // Create the timestamp in the required format: YYYYMMDDHHmmss
  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  // Encode the password as Base64 (ShortCode + Passkey + Timestamp)
  const password = Buffer.from(shortCode + passkey + timestamp).toString(
    "base64"
  );

  // STK Push request payload
  const data = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: 1,
    PartyA: `254${phone}`,
    PartyB: shortCode, // Typically the same as BusinessShortCode
    PhoneNumber: `254${phone}`,
    CallBackURL: "https://17e0-154-159-237-182.ngrok-free.app/mpesa/callback", // Replace with your actual callback URL
    AccountReference: "Test",
    TransactionDesc: "Test Payment",
  };

  try {
    // Make STK Push request to Safaricom's Daraja API
    const response = await axios.post(url, data, {
      headers: {
        authorization: `Bearer ${token}`, // Use the generated token
      },
    });
    res.json(response.data); // Send the response data back to the client
  } catch (err) {
    console.error("Error generating STK:", err);
    res.status(500).send("Error generating STK");
  }
};

// Callback handler to process the response from Safaricom
const mpesaCallback = (req, res) => {
  console.log("callback successful");
  const callbackData = req.body;
  console.log(
    "Received M-Pesa Callback:",
    JSON.stringify(callbackData, null, 2)
  );

  // Extract necessary information from the callback
  const resultCode = callbackData?.Body?.stkCallback?.ResultCode;
  const resultDesc = callbackData?.Body?.stkCallback?.ResultDesc;

  if (resultCode === 0) {
    // Transaction was successful
    console.log("Transaction Successful:", resultDesc);
    // Add your logic to update your database or application state as needed
  } else {
    // Transaction failed or was cancelled by user
    console.log("Transaction Failed or Cancelled:", resultDesc);
    // Add your error handling or application state update here
  }

  // Respond to Safaricom to acknowledge receipt of the callback
  res.status(200).json({ message: "Callback received successfully" });
};

module.exports = { stkController, stkPush, mpesaCallback };
