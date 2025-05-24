import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// 注册
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

// 登录
export const login = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = { role: role.toLowerCase() };

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      query.email = identifier;
    } else {
      query.studentId = identifier;
    }

    const user = await User.findOne(query);

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

    // ✅ 登录历史记录 + 修复 identifier 缺失
    const agent = req.headers["user-agent"] || "unknown";
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    if (!user.identifier) {
      user.identifier = user.email || user.studentId || "unknown";
    }

    user.loginHistory = user.loginHistory || [];
    user.loginHistory.push({
      date: new Date(),
      ip: ip || "unknown",
      device: agent || "unknown",
      location: "Singapore",
      status: "success"
    });

    await user.save();

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

// 重置密码
export const resetPassword = async (req, res) => {
  const { identifier, newPassword } = req.body;

  if (!identifier || !newPassword) {
    return res.status(400).json({ message: 'Identifier and new password are required.' });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { studentId: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('❌ Reset password error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
