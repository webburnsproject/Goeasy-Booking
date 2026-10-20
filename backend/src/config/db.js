const mongoose = require('mongoose');

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1 || isConnecting) {
    return mongoose.connection;
  }

  try {
    isConnecting = true;
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || 'goeasy_booking',
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`[MongoDB Connected]: ${conn.connection.host} / Database: ${conn.connection.name}`);
    isConnecting = false;
    return conn;
  } catch (error) {
    isConnecting = false;
    console.error(`[MongoDB Connection Error]: ${error.message}. Scheduling auto-retry in 3s...`);
    setTimeout(connectDB, 3000);
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB Notice]: Disconnected from database. Reconnecting in 3s...');
  setTimeout(connectDB, 3000);
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB Runtime Error]:', err.message);
});

module.exports = connectDB;
