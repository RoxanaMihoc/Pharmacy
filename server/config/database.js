// config/database.js
const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://roxanamihoc67:Roxana123@cluster0.85fbtf2.mongodb.net/Products?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error.message);
  });

module.exports = mongoose;
