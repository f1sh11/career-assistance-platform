// middleware/logger.js

const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

// 日志目录
const logDirectory = path.join(__dirname, '../../src/logs');

// 确保日志目录存在
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// 自定义日志格式
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// 创建 logger
const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDirectory, 'auth.log'), level: 'info' })
  ],
});

// 如果在开发环境，也输出到控制台
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

module.exports = logger;
