const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
  },
  organizationType: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  foodKG: {
    type: String,
    required: true,
  },

  collectOrDeliver: {
    type: String,
  },
  deliveryAddress: {
    type: String,
  },
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
