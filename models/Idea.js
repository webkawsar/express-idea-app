const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        allowComments: {
            type: Boolean,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
        // eslint-disable-next-line comma-dangle
    }
);

const Idea = mongoose.model('Idea', ideaSchema);
module.exports = Idea;
