// src/controllers/upload.controller.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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
    const filename = `avatar-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// 上传头像的路由
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file received' });
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    console.log(`✅ 文件保存成功：${avatarPath}`);

    res.status(200).json({
      message: '头像上传成功',
      avatarUrl: avatarPath
    });
  } catch (error) {
    console.error('❌ 上传失败:', error.message);
    res.status(500).json({ message: '上传失败', error: error.message });
  }
};

export const uploadAvatarMiddleware = upload.single('avatar');