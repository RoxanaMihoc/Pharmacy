// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { usersDB } = require('../config/database');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  CNP: { type: String, required: true },
  cart:{type: Array, required: true}
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

const User = usersDB.model('User', userSchema, 'patients');

module.exports = User;
