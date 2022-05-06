const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    tagName: {
        type: String,
        required: true,
        trim: true,
    },
    idea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Idea',
    },
});

const Tag = mongoose.model('tag', tagSchema);
module.exports = Tag;
