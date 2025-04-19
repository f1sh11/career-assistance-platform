// server.js (完整增强版 - 启用头像上传读取 + 安全与日志配置)
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

import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';
import { writeLog, writeError } from './src/utils/logHelper.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ✅ 解决 __dirname in ESM
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

// ✅ 确保 uploads 目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ 访问日志记录
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'morgan-access.log'), { flags: 'a' });

// 🛡️ 安全中间件
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}));

// 🌐 通用中间件
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 静态托管 uploads 文件夹（头像访问核心）
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, path) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// 📝 日志中间件
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// 🌱 连接数据库
connectDB();

// 📦 注册 API 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/upload', uploadRoutes);

// ❤️ 健康检查
app.get('/api/status', (req, res) => {
  res.json({ message: 'The server is running fine.', timestamp: new Date() });
});

// ✅ 根路径防止 CORS GET 404
app.get('/', (req, res) => {
  res.send('Backend root OK');
});

// ❗全局错误处理
app.use((err, req, res, next) => {
  logger.error(err.stack);
  writeError(`Unhandled error: ${err.message}`, err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({ error: message });
});

// 🚀 启动服务
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port: ${PORT}`);
  writeLog('server', `Server started on port ${PORT}`);
});

// 🧼 优雅关闭
const gracefulShutdown = () => {
  console.log('🛑 Shutting down gracefully...');
  logger.info('🛑 Server shutting down');
  server.close(() => {
    console.log('✅ HTTP server closed.');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed.');
      process.exit(0);
    });
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  logger.error(`❌ Uncaught Exception: ${err.message}`);
  writeError(`Uncaught Exception: ${err.message}`, err.stack);
  gracefulShutdown();
});