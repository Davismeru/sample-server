const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const mongooose = require("mongoose");

const dotenv = require("dotenv");
require("dotenv").config();

app.use(cors());
app.use(express.json());

// signup middleware
const signupRouter = require("./routes/signup_route");
app.use("/", signupRouter);

// signin middleware
const signinRouter = require("./routes/signin_route");
app.use("/", signinRouter);

// confirm auth middleware
const authRouter = require("./routes/auth_check_route");
app.use("/", authRouter);

// check in middleware
const checkinRouter = require("./routes/chekin_route");
app.use("/", checkinRouter);

// packages middleware
const packagesRouter = require("./routes/packages_route");
app.use("/", packagesRouter);

// mongodb connection
const uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
mongooose
  .connect(uri)
  .then(() => {
    app.listen(PORT, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    proccess.exit();
    console.log("error connecting to database");
  });
