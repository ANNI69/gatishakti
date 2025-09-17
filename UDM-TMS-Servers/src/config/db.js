const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    // Use environment variable or default to local MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://codebyanii_db_user:NgQRnJHavq7LPNGT@cluster0.topabge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    console.error('Please ensure MongoDB is running and accessible.');
    console.error('You can also set MONGO_URI environment variable or create a .env file with:');
    console.error('MONGO_URI=mongodb://localhost:27017/udm-tms-mock');
    process.exit(1);
  }
};

module.exports = connectDB;