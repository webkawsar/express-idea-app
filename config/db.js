const mongoose = require('mongoose');

const URL = process.env.LOCAL_DB;
const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log('Database is connected');
    } catch (error) {
        console.log(`Database connection error: ${error.message}`);
    }
};

module.exports = { connectDB, URL };
