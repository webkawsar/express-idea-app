const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const fs = require('fs');
const util = require('util');
const path = require('path');
const Idea = require('./Idea');

const deleteFilePromise = util.promisify(fs.unlink);
const userSchema = new mongoose.Schema(
    {
        googleID: String,
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: [10, "First name can't accept greater than 10 char"],
            minlength: 3,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: [10, "Last name can't accept greater than 10 char"],
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: [6, "Password can't accept less than 6 char"],
            validate: {
                // eslint-disable-next-line consistent-return
                validator(v) {
                    const passArray = ['password', 'iloveyou'];
                    const isMatched = passArray.some((pass) => v.includes(pass));
                    if (isMatched) return false;
                },
                message: "Password can't set common word or text",
            },
        },
        role: {
            type: Number,
            default: 0,
        },
        image: String,
        imageURL: String,
        isVerified: {
            type: Boolean,
            default: false,
        },
        isToken: String,
    },
    {
        versionKey: false,
        timestamps: true,
        toObject: {
            virtuals: true,
        },
    }
);
// eslint-disable-next-line func-names
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashedPassword = await bcryptjs.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    } else {
        next();
    }
});

// get users ideas
userSchema.virtual('ideas', {
    ref: 'Idea',
    localField: '_id',
    foreignField: 'user._id',
});

// eslint-disable-next-line func-names
userSchema.pre('remove', async function (next) {
    const { id, image } = this;
    const ideas = await Idea.find({ 'user.id': id });
    // eslint-disable-next-line array-callback-return
    ideas.map((idea) => {
        if (idea.image) {
            deleteFilePromise(`${path.join(__dirname, '../public/uploads/ideas')}/${idea.image}`);
        }
    });

    await Idea.deleteMany({ 'user.id': id });
    if (image) {
        deleteFilePromise(`${path.join(__dirname, '../public/uploads/users')}/${image}`);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
