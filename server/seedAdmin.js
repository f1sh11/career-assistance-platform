import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.model.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin already exists. Skipping.');
      return;
    }

    const admin = await User.create({
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin'
    });

    console.log('✅ Admin created:', admin.email);
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
