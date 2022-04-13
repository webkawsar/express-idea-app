const mongoose = require('mongoose');
// const { commentSchema } = require('./Comment');

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
        // tags: {
        //     // type: Array,
        //     type: [String],
        //     required: true,
        //     trim: true,
        //     validate: {
        //         validator(v) {
        //             return v[0].length > 0;
        //         },
        //         message: 'Idea must have one tag',
        //     },
        // },
        tags: [
            {
                type: String,
                required: [true, 'Idea must have one tag'],
            },
        ],
        // comments: [
        //     {
        //         title: {
        //             type: String,
        //             required: true,
        //             maxlength: 100,
        //             trim: true,
        //         },
        //         text: {
        //             type: String,
        //             required: true,
        //             maxlength: 1000,
        //             trim: true,
        //         },
        //     },
        // ],
        // comments: [commentSchema],
        // comments: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'Comment',
        //     },
        // ],
    },
    {
        versionKey: false,
        timestamps: true,
        toObject: {
            virtuals: true,
        },
    }
);
ideaSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'idea',
    justOne: false,
});

const Idea = mongoose.model('Idea', ideaSchema);
module.exports = Idea;
