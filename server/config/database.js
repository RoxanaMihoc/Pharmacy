// config/database.js
const mongoose = require("mongoose");

// mongoose.connect(
//     "mongodb+srv://roxanamihoc67:Roxana123@cluster0.85fbtf2.mongodb.net/Products?retryWrites=true&w=majority"
//   )
//   .then(() => {
//     console.log("Database connected");
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });
const productsDB = mongoose.createConnection('mongodb+srv://roxanamihoc67:Roxana123@cluster0.85fbtf2.mongodb.net/Products?retryWrites=true&w=majority');
const usersDB = mongoose.createConnection('mongodb+srv://roxanamihoc67:Roxana123@cluster0.85fbtf2.mongodb.net/Users?retryWrites=true&w=majority');
const doctorsDB = mongoose.createConnection('mongodb+srv://roxanamihoc67:Roxana123@cluster0.85fbtf2.mongodb.net/Doctors?retryWrites=true&w=majority');
const ordersDB = mongoose.createConnection('mongodb+srv://roxanamihoc67:Roxana123@cluster0.85fbtf2.mongodb.net/Orders?retryWrites=true&w=majority');
const notifDB = mongoose.createConnection('mongodb+srv://roxanamihoc67:Roxana123@cluster0.85fbtf2.mongodb.net/Notifications?retryWrites=true&w=majority');
const prescriptionDB = mongoose.createConnection('mongodb+srv://roxanamihoc67:Roxana123@cluster0.85fbtf2.mongodb.net/Prescriptions?retryWrites=true&w=majority');
const pharmacyDB = mongoose.createConnection('mongodb+srv://roxanamihoc67:Roxana123@cluster0.85fbtf2.mongodb.net/Pharmacy?retryWrites=true&w=majority');
const pharmacistDB = mongoose.createConnection('mongodb+srv://roxanamihoc67:Roxana123@cluster0.85fbtf2.mongodb.net/Pharmacist?retryWrites=true&w=majority');

module.exports = {
  productsDB,
  usersDB,
  doctorsDB,
  ordersDB,
  notifDB,
  prescriptionDB,
  pharmacyDB,
  pharmacistDB
};
