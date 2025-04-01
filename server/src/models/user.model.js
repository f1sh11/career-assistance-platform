const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    unique: true,
    trim: true
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
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    major: { type: String, default: '' }, 
    interests: { type: String, default: '' },
    skills: { type: String, default: '' },
    dreamJob: { type: String, default: '' },
    introduction: { type: String, default: '' },
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
userSchema.pre('save', async function(next) {
  try {
    // Re-encrypt only if the password is changed
    if (!this.isModified('password')) return next();
    
    // Generate salt values
    const salt = await bcrypt.genSalt(10);
    
    // Password encryption
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Verify the password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 