// src/controllers/upload.controller.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/user.model.js';
import { writeLog, writeError } from '../utils/logHelper.js';
import crypto from "crypto";

// 确保 uploads 文件夹存在
const uploadPath = path.resolve('uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// 设置 multer 存储方式
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = crypto.randomBytes(8).toString("hex");
    const filename = `avatar-${safeName}${ext}`;
    cb(null, filename);
  }
});

// 过滤文件类型，只允许 jpg/png/jpeg
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('仅支持 JPG 和 PNG 格式'), false);
  }
};

// 限制上传大小为 1MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 }
});

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '未收到文件' });
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    const userId = req.user?._id;
    console.log(`✅ 文件保存成功：${avatarPath}`);

    if (userId) {
      const user = await User.findById(userId);
      const oldPath = user?.profile?.avatarUrl;
      if (oldPath && oldPath.startsWith('/uploads/')) {
        const fullPath = path.join(uploadPath, path.basename(oldPath));
        try {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`🗑️ 旧头像已删除: ${fullPath}`);
          }
        } catch (err) {
          console.warn('⚠️ 删除旧头像失败:', err.message);
        }
      }

      user.profile.avatarUrl = avatarPath; // ✅ 始终更新 URL
      await user.save();

      writeLog('user', 'Uploaded avatar and updated profile', {
        userId: userId.toString(),
        avatarUrl: avatarPath,
        url: req.originalUrl
      });
    }

    res.status(200).json({
      message: '头像上传成功',
      avatarUrl: avatarPath
    });
  } catch (error) {
    console.error('❌ 上传失败:', error.message);
    writeError(`头像上传失败: ${error.message}`, error.stack);
    res.status(500).json({ message: '上传失败', error: error.message });
  }
};

export const uploadAvatarMiddleware = upload.single('avatar');
