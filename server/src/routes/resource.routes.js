import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  getAuditLogs,
  uploadResource,
  getResources,
  getPendingResources,
  approveResource,
  rejectResource,
  uploadFile,
  deleteResource
} from "../controllers/resource.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router(); // ✅ 必须在这里先声明

router.delete("/:id", authenticateToken, deleteResource);
// ✅ 删除资源（上传者本人或管理员）
// ✅ 放在 router 初始化之后
router.get("/logs", authenticateToken, getAuditLogs);

// 处理 __dirname (__ESM compatibility)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置 multer 存储上传文件
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueName = `${timestamp}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ 公共接口：获取已通过的资源（分页 + 搜索）
router.get("/", getResources);

// ✅ 上传资源（mentor, industry, admin）
router.post("/", authenticateToken, uploadResource);

// ✅ 上传本地文件（所有上传用户）
router.post("/upload-file", upload.single("file"), uploadFile);

// ✅ 管理员接口：获取待审核资源
router.get("/pending", authenticateToken, getPendingResources);

// ✅ 管理员接口：审批 / 驳回资源
router.put("/:id/approve", authenticateToken, approveResource);
router.put("/:id/reject", authenticateToken, rejectResource);

export default router;
