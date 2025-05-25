const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Loading environment variables
dotenv.config();

// Logging MongoDB URIs
console.log('Trying to connect to the：', process.env.MONGODB_URI);

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4
};

// Trying to connect
mongoose.connect(process.env.MONGODB_URI, mongoOptions)
  .then(() => {
    console.log('MongoDB connection test was successful!');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('MongoDB Connection Test Failed.', err.message);
    console.error('Error details：', err);
  }); 