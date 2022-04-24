const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const Idea = require('./Idea');

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
            maxlength: 20,
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
    const { id } = this;
    await Idea.deleteMany({ 'user.id': id });
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
