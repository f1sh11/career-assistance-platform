// src/utils/logger.js
import { createLogger, format, transports } from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(__dirname, '../logs/app.log') })
  ],
});

export const writeLog = (scope, message, metadata = {}) => {
  logger.info(`[${scope}] ${message} ${JSON.stringify(metadata)}`);
};

export const writeError = (message, stack) => {
  logger.error(`[ERROR] ${message}`);
  if (stack) logger.error(stack);
};

export default logger;

