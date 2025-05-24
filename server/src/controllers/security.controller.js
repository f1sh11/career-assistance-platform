// src/controllers/security.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(400).json({ message: "Incorrect current password" });

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to change password", error: err.message });
  }
};

export const getLoginHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("loginHistory");
    console.log("✅ loginHistory from DB:", user.loginHistory);
    res.status(200).json({ loginHistory: user.loginHistory || [] });
  } catch (err) {
    console.error("❌ Failed to get login history:", err.message);
    res.status(500).json({ message: "Failed to fetch login records", error: err.message });
  }
};