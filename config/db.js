const mongoose = require('mongoose');

const databaseURL = 'mongodb://localhost:27017/idea-app';
const connectDB = async () => {
    try {
        await mongoose.connect(databaseURL);
        console.log('Database is connected');
    } catch (error) {
        console.log(`Database connection error: ${error.message}`);
    }
};

module.exports = { connectDB, databaseURL };
