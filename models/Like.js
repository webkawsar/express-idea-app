const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
    {
        idea: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Idea',
            required: true,
        },
        user: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            firstName: String,
            lastName: String,
            email: String,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
