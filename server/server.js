import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import matchingRoutes from './src/routes/matching.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';
import postRoutes from './src/routes/posts.js';
import commentRoutes from './src/routes/comments.js';
import resourceRoutes from './src/routes/resource.routes.js'; 

import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';
import { writeLog, writeError } from './src/utils/logHelper.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 确保日志目录存在
const logDirectory = path.join(__dirname, 'src/logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// ✅ 确保 uploads 目录存在（用于头像 + 资源文件上传）
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'morgan-access.log'), { flags: 'a' });

// ✅ 安全中间件
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}));

// ✅ 通用中间件
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 静态托管 uploads 目录（头像和资源文件）
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, path) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// ✅ 日志中间件
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// ✅ 数据库连接
connectDB();

// ✅ 注册 API 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/resources', resourceRoutes); // ✅ 注册资源模块路由

// ✅ 健康检查
app.get('/api/status', (req, res) => {
  res.send('✅ Server is up and running!');
});

// ✅ 根路径兼容处理
app.get('/', (req, res) => {
  res.send('Backend root OK');
});

// ✅ 全局错误处理
app.use((err, req, res, next) => {
  logger.error(err.stack);
  writeError(`Unhandled error: ${err.message}`, err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({ error: message });
});

// ✅ 启动服务
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});

