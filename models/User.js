const mongoose = require('mongoose');

// define users Schema & Model
const userSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  role:      { type: String, default: 'user' },

  // Profile 字段
  selfIntroduction: { type: String },
  phoneNumber:      { type: String },
  address:          { type: String },
  major:            { type: String },
  interests:        { type: [String] },
  skills:           { type: [String] },
  dreamJob:         { type: String },

  createdAt:  { type: Date, default: Date.now },
  updatedAt:  { type: Date, default: Date.now },
  lastLogin:  { type: Date }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
