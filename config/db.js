const mongoose = require('mongoose');

let URL = '';
if (process.env.NODE_ENV === 'development') {
    URL = process.env.LOCAL_DB;
} else {
    URL = process.env.CLOUD_DB;
}

mongoose.set('strictQuery', true);

const connectDB = async () => {
    try {
        await mongoose.connect(URL);

        const typeofDB = process.env.NODE_ENV === 'development' ? 'localDB' : 'cloudDB';
        console.log(`Database is connected on ${typeofDB}`);
    } catch (error) {
        console.log(`Database connection error: ${error.message}`);
    }
};

module.exports = { connectDB, URL };
