const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const DB = process.env.MONGO_URI || 'mongodb://localhost:27017/ytclone';
        const conn = await mongoose.connect(DB);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
