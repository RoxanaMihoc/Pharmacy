// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { usersDB } = require('../config/database');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  identifier: { type: String, unique: true, required: true },
  role: { type: String},
  cart:{type: Array, required: true},
  favorites:{type: Array, required: true},
  doctor: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  birth_date: { type: String, required: true },
  postal_code: { type: String, required: true },
  photo:{type: String},
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  maritalStatus: { type: String, required: true },
  medicationList: { type: String},
  allergies: { type: String },
  doctorNameB:{type:String},

});

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = usersDB.model('User', userSchema);

module.exports = User;