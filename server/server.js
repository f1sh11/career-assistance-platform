// server.jimport { fileURLToPath } from 'url';
console.log("🔥 正确的 server.js 已运行！");

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
import postRoutes from './src/routes/posts.js';
import commentRoutes from './src/routes/comments.js';

import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';
import { writeLog, writeError } from './src/utils/logHelper.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

const logDirectory = path.join(__dirname, 'src/logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'morgan-access.log'), { flags: 'a' });

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests from this IP.' }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// ✅ Debug route
app.get('/api/status', (req, res) => {
  res.send('✅ Server is up and running!');
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});



