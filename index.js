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
const moment = require('moment');
const { format } = require('date-fns');
const { compareValues, truncateText, compareOwner } = require('./helpers');

// config
const { connectDB, URL } = require('./config/db');
// routes
const ideasRoute = require('./routes/idea');
const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');
const commentRoute = require('./routes/comment');

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
            moment(date) {
                return moment(date).toNow();
            },
            formatDate(date, dateFormat) {
                return format(date, dateFormat);
            },
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
    res.locals.user = req?.user ? req.user : null;
    // eslint-disable-next-line no-underscore-dangle
    res.locals.userId = req?.user ? req.user._id : null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error = req.flash('error');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));

// auth
app.use('/auth', authRoute);
app.use('/ideas', ideasRoute);
app.use('/ideas/:id/comments', commentRoute);

app.use('/', indexRoute);

// Error handling middleware
app.use(errorMiddleware);

// Server listening
app.listen(8080, () => {
    console.log('Server is listening on: 8080');
});
