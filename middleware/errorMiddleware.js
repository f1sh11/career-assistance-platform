// middleware/errorMiddleware.js

const fs = require('fs');
const path = require('path');

// 日志目录
const logDirectory = path.join(__dirname, '../../src/logs');

// 确保日志目录存在
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// 错误处理中间件
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // 错误信息内容
  const errorMessage = `${new Date().toISOString()} - Error: ${err.message}\nStack: ${err.stack}\n`;

  // 写入 error.log
  fs.appendFileSync(path.join(logDirectory, 'error.log'), errorMessage);

  // 返回错误响应
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error'
  });
};

module.exports = errorMiddleware;