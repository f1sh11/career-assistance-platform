const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const matchingRoutes = require('./src/routes/matching.routes');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });


const app = express();
const PORT = process.env.PORT || 5000;

// Create a log directory
const logDirectory = path.join(__dirname, 'src/logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Create a log stream
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

// Middleware Configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// Connecting to the database
connectDB();

// Routing
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
  
  // Record errors to a log file
  fs.appendFileSync(
    path.join(logDirectory, 'error.log'),
    `${new Date().toISOString()} - ${statusCode} - ${message}\n${err.stack}\n\n`
  );
  
  res.status(statusCode).json({ error: message });
});

app.listen(PORT, () => {
  logger.info(`The server is running on port: ${PORT}`);
  // Record server startup to log
  fs.appendFileSync(
    path.join(logDirectory, 'server.log'),
    `${new Date().toISOString()} - The server is on port ${PORT} activate\n`
  );
}); 