// server/src/routes/upload.routes.js
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { uploadAvatar, uploadAvatarMiddleware } from "../controllers/upload.controller.js";

const router = express.Router();

router.post('/upload-avatar', authenticateToken, uploadAvatarMiddleware, uploadAvatar);

const generalStorage = multer.diskStorage({
  destination: path.resolve("uploads"),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueName = `${timestamp}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const uploadGeneralFile = multer({ storage: generalStorage });

router.post(
  "/chat-file",
  authenticateToken,
  uploadGeneralFile.single("avatar"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype;
    res.json({ fileUrl, fileType });
  }
);

export default router;


