// server.js (ESM + 安全增强 + 结构化日志)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import matchingRoutes from './src/routes/matching.routes.js';
import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';
import { writeLog, writeError } from './src/utils/logHelper.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Create log directory if it doesn't exist
const logDirectory = path.join(__dirname, 'src/logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Access log via morgan
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'morgan-access.log'), { flags: 'a' });

// 🛡️ 安全中间件
app.use(helmet());
app.use(mongoSanitize());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}));

// 🌐 通用中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan access logging
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// 🌱 连接数据库
connectDB();

// 路由注册
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matching', matchingRoutes);

// 健康检查
app.get('/api/status', (req, res) => {
  res.json({ message: 'The server is running fine.', timestamp: new Date() });
});

// ❗错误处理中间件（日志写入 error.log）
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
