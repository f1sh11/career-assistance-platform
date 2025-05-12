import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const register = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({
      $or: [{ email: identifier }, { studentId: identifier }],
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    let newUserData = {
      password,
      role: role.toLowerCase(),
    };

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      newUserData.email = identifier;
      newUserData.identifier = identifier;
    } else {
      newUserData.studentId = identifier;
      newUserData.identifier = identifier;
    }

    const newUser = new User(newUserData);
    await newUser.save();

    console.log('✅ Registered new user:', newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    console.log("📥 Login input:", { identifier, password, role });

    if (!identifier || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = { role: role.toLowerCase() };

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      query.email = identifier;
    } else {
      query.studentId = identifier;
    }

    console.log("🔍 Login query:", query);

    const user = await User.findOne(query);

    console.log("📄 User found:", user);

    if (!user) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};




