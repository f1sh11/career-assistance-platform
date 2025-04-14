// server.js (ESM version)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import matchingRoutes from './src/routes/matching.routes.js';
import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';
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
  fs.mkdirSync(logDirectory);
}

// Create a log stream
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matching', matchingRoutes);

// API status checking
app.get('/api/status', (req, res) => {
  res.json({ message: 'The server is running fine.', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  fs.appendFileSync(
    path.join(logDirectory, 'error.log'),
    `${new Date().toISOString()} - ${statusCode} - ${message}\n${err.stack}\n\n`
  );

  res.status(statusCode).json({ error: message });
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`\u{1F680} Server running on port: ${PORT}`);
  fs.appendFileSync(
    path.join(logDirectory, 'server.log'),
    `${new Date().toISOString()} - Server started on port ${PORT}\n`
  );
});

// Graceful shutdown
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

process.on('SIGINT', gracefulShutdown); // Ctrl+C
process.on('SIGTERM', gracefulShutdown); // kill command
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  logger.error(`❌ Uncaught Exception: ${err.message}`);
  gracefulShutdown();
});
