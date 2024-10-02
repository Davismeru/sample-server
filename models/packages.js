const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// generate random unique id

const packagesSchema = new Schema({
  basic: {
    type: Object,
    required: true,
    default: {
      name: "basic",
      price: 0,
    },
  },
  hustler: {
    type: Object,
    required: true,
    default: {
      name: "hustler",
      price: 500,
    },
  },
  investor: {
    type: Object,
    required: true,
    default: {
      name: "investor",
      price: 1500,
    },
  },

  enterpreneur: {
    type: Object,
    required: true,
    default: {
      name: "enterpreneur",
      price: 5000,
    },
  },

  executive: {
    type: Object,
    required: false,
    default: {
      name: "executive",
      price: 10000,
    },
  },
});

module.exports = mongoose.model("packages", packagesSchema);
