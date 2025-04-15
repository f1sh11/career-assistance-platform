// src/utils/logHelper.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logDirectory = path.join(__dirname, '../logs');

// 创建日志文件夹（如果还没有）
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

/**
 * 写入普通日志
 * @param {string} type - 日志类型文件（如 'auth', 'user', 'matching'）
 * @param {string} message - 日志内容
 */
export const writeLog = (type, message) => {
  const filename = `${type}.log`;
  const fullPath = path.join(logDirectory, filename);
  const content = `${new Date().toISOString()} - ${message}\n`;

  fs.appendFile(fullPath, content, (err) => {
    if (err) console.error(`🚨 Failed to write to ${filename}:`, err.message);
  });
};

/**
 * 写入错误日志（统一写入 error.log）
 * @param {string} message - 错误信息
 * @param {string} stack - 错误堆栈（可选）
 */
export const writeError = (message, stack = '') => {
  const fullPath = path.join(logDirectory, 'error.log');
  const content = `${new Date().toISOString()} - ${message}\n${stack}\n`;

  fs.appendFile(fullPath, content, (err) => {
    if (err) console.error(`🚨 Failed to write to error.log:`, err.message);
  });
};
