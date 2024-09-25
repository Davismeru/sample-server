const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// generate random unique id
const unique_id = Math.floor(Math.random() * 999999999);

const usersSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    refferal_code: {
      type: String,
      required: true,
      default: unique_id,
    },

    reffered_by: {
      type: String,
      required: false,
    },

    balance: {
      type: Number,
      required: false,
      default: 0,
    },

    package: {
      type: String,
      required: true,
      default: "basic",
    },

    checkedIn: {
      type: Boolean,
      required: true,
      default: false,
    },

    checkedDays: {
      type: Number,
      required: true,
      default: 0,
    },

    checkedInTime: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", usersSchema);
