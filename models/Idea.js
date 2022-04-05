const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [3, 'Please provide title at least 3 char'],
            maxlength: [30, 'Please provide title max 30 char'],
            // set(v) {
            //     return v.toLowerCase();
            // },
            // get(v) {
            //     return v.toUpperCase();
            // },
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'Description is required'],
            minlength: [10, 'Please provide description at least 3 char'],
            maxlength: [10000, 'Please provide description max 10000 char'],
        },
        allowComments: {
            type: Boolean,
            required: [true, 'Allow comments is required'],
        },
        status: {
            type: String,
            required: [true, 'Status is required'],
            enum: {
                values: ['public', 'private'],
                message: 'Please select status public or private',
            },
            trim: true,
            lowercase: true,
        },
    },
    {
        versionKey: false,
        // eslint-disable-next-line comma-dangle
    }
);

const Idea = mongoose.model('Idea', ideaSchema);
module.exports = Idea;
