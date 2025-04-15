// src/utils/logHelper.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logDirectory = path.join(__dirname, '../logs');

// 自动创建 logs 目录
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

/**
 * 写入结构化 JSON 日志（行为日志）
 * @param {string} type - 日志类型（auth, user, matching）
 * @param {string} message - 主信息
 * @param {object} meta - 附加数据（userId, url, role 等）
 */
export const writeLog = (type, message, meta = {}) => {
  const filename = `${type}.log`;
  const fullPath = path.join(logDirectory, filename);
  const log = {
    timestamp: new Date().toISOString(),
    type,
    level: 'info',
    message,
    ...meta
  };

  fs.appendFile(fullPath, JSON.stringify(log, null, 2) + '\n\n', (err) => {
    if (err) console.error(`🚨 Failed to write to ${filename}:`, err.message);
  });
};

/**
 * 写入错误日志（error.log），记录堆栈
 * @param {string} message - 错误信息
 * @param {string} stack - 错误堆栈
 */
export const writeError = (message, stack = '') => {
  const fullPath = path.join(logDirectory, 'error.log');
  const log = {
    timestamp: new Date().toISOString(),
    type: 'error',
    level: 'error',
    message,
    stack
  };

  fs.appendFile(fullPath, JSON.stringify(log, null, 2) + '\n\n', (err) => {
    if (err) console.error(`🚨 Failed to write to error.log:`, err.message);
  });
};
