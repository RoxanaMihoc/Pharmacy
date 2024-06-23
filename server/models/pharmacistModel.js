const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { pharmacistDB } = require("../config/database");

const pharmacistSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  identifier: { type: String, required: true },
  role: { type: String, required: true },
  patients: { type: Array, required: true },
});

pharmacistSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

pharmacistSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

const Pharmacist = pharmacistDB.model("Pharmacist", pharmacistSchema, 'pharmacist');

module.exports = Pharmacist;