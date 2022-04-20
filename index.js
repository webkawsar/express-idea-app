const express = require('express');
require('dotenv').config();
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const flash = require('connect-flash');
require('express-async-errors');

const {
    compareValues,
    truncateText,
    compareOwner,
    moment,
    formatDate,
    comparePath,
    incrementedIndex,
} = require('./helpers');

// config
const { connectDB, URL } = require('./config/db');
// routes
const ideasRoutes = require('./routes/idea');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comment');
const userRoutes = require('./routes/user');

// middleware
const errorMiddleware = require('./middleware/errorMiddleware');
// require('./config/passport')(passport);
const { localStrategy, googleStrategy } = require('./config/passport');

// Database connection
connectDB();

// App object
const app = express();

// app.engine('handlebars', exphbs);
app.engine(
    '.hbs',
    exphbs({
        extname: '.hbs',
        helpers: {
            compareValues,
            truncateText,
            compareOwner,
            moment,
            formatDate,
            comparePath,
            incrementedIndex,
        },
    })
);
app.set('view engine', '.hbs');
// Middleware

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: URL }),
        cookie: {
            maxAge: 2 * 60 * 100 * 1000,
            httpOnly: true,
            sameSite: 'lax',
        },
    })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
localStrategy(passport);
googleStrategy(passport);

app.use((req, res, next) => {
    res.locals.loggedInUser = req?.user ? req.user : null;
    res.locals.firstName = req?.user ? req.user.firstName : null;
    // eslint-disable-next-line no-underscore-dangle
    res.locals.loggedInUserId = req?.user ? req.user._id : null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error = req.flash('error');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));

// auth
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/ideas', ideasRoutes);
app.use('/ideas/:id/comments', commentRoutes);
app.use('/', indexRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Server listening
app.listen(8080, () => {
    console.log('Server is listening on: 8080');
});
