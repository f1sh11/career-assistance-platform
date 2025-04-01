const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true }, // This can be a username or email address
  password:   { type: String, required: true },
  role: { type: String, enum: ['student', 'mentor', 'industry', 'admin'], default: 'student' }
});

module.exports = mongoose.model('User', userSchema);
