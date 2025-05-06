// src/models/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address'],
    lowercase: true,
    trim: true,
    unique: true,
    sparse: true // 因为 student 不一定有 email
  },
  studentId: {
    type: String,
    trim: true,
    unique: true,
    sparse: true // 因为 mentor/industry 不一定有 studentId
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'mentor', 'industry', 'admin'],
    required: true
  },
  profile: {
    name: { type: String, maxlength: 50, trim: true, default: '' },
    phone: { type: String, match: [/^\+?[0-9\s\-]{7,20}$/, 'Please fill a valid phone number'], default: '' },
    email: { type: String, match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address'], lowercase: true, trim: true, default: '' },
    address: { type: String, maxlength: 50, default: '' },
    major: { type: String, maxlength: 50, default: '' },
    interests: { type: String, maxlength: 50, default: '' },
    skills: { type: String, maxlength: 50, default: '' },
    dreamJob: { type: String, maxlength: 20, default: '' },
    introduction: { type: String, maxlength: 100, default: '' },
    avatarUrl: { type: String, default: '' }
  },
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Encrypt passwords before saving
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Verify the password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
