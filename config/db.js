const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/idea-app');
        console.log('Database is connected');
    } catch (error) {
        console.log(`Database connection error: ${error.message}`);
    }
};

module.exports = connectDB;
