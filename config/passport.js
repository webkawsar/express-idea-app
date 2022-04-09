const LocalStrategy = require('passport-local');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');

const localStrategy = (passport) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
            },
            // eslint-disable-next-line consistent-return
            async (email, password, next) => {
                // check user by email
                const user = await User.findOne({ email });

                if (!user) {
                    return next(null, false, { message: 'Invalid email or password' });
                }

                // checking password and compare password
                const isMatch = await bcryptjs.compare(password, user.password);
                if (isMatch) {
                    return next(null, user, { message: 'Logged in successfully' });
                }

                next(null, false, { message: 'Invalid email or password' });
            }
        )
    );
    passport.serializeUser((user, next) => {
        next(null, user);
    });
    passport.deserializeUser((id, next) => {
        User.findById(id, (err, user) => {
            next(err, user);
        });
    });
};

module.exports = localStrategy;
