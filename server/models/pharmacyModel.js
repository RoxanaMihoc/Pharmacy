const mongoose = require("mongoose");
const { pharmacyDB } = require("../config/database");

const PharmacySchema = new mongoose.Schema({
  name: String,
  location: String,
  photo: String,
  email: String,
  pharmacistId:String,
  inventory: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: String,
      category: String,
      title: String,
      brand: String,
      price: Number,
      photo: String,
    },
  ],
});

module.exports = pharmacyDB.model("Pharmacy", PharmacySchema, "pharmacy");
