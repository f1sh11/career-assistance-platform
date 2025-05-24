// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

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

import PrivateMessage from './src/models/PrivateMessage.js';
import messageRoutes from './src/routes/message.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

const logDirectory = path.join(__dirname, 'src/logs');
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory, { recursive: true });

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'morgan-access.log'), { flags: 'a' });
const isDev = process.env.NODE_ENV !== 'production';

app.use(helmet());
if (!isDev) {
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
  }));
}

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.resolve('uploads'), {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/status', (req, res) => res.send('Server is up and running!'));
app.get('/', (req, res) => res.send('Backend root OK'));

app.use((err, req, res, next) => {
  logger.error(err.stack);
  writeError(`Unhandled error: ${err.message}`, err.stack);
  res.status(err.statusCode || 500).json({ error: err.message || 'Internal server error' });
});

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  socket.on('join', ({ userId }) => {
    socket.join(userId);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
    try {
      const message = await PrivateMessage.create({ senderId, receiverId, text });
      io.to(receiverId).emit('receiveMessage', message);
      io.to(senderId).emit('receiveMessage', message);
    } catch (err) {
      console.error('Send message error:', err.message);
    }
  });

  socket.on('disconnect', () => {});
});

server.listen(PORT, () => {
  console.log(`Backend + WebSocket running on port ${PORT}`);
});


