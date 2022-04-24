const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
            unique: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
