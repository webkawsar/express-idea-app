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
const csrf = require('csurf');
// const helmet = require('helmet');
const compression = require('compression');

const {
    compareValues,
    truncateText,
    compareOwner,
    moment,
    formatDate,
    comparePath,
    incrementedIndex,
    comparePagination,
} = require('./helpers');

// config
const { connectDB, URL } = require('./config/db');
// routes
const ideasRoutes = require('./routes/idea');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comment');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');

// middleware
const errorMiddleware = require('./middleware/errorMiddleware');
// require('./config/passport')(passport);
const { localStrategy, googleStrategy } = require('./config/passport');

// Database connection
connectDB();

// App object
const app = express();
const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: URL }),
    name: 'ideaApp',
    cookie: {
        maxAge: 2 * 60 * 100 * 1000,
        httpOnly: true,
        sameSite: 'lax',
    },
}

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
            comparePagination,
        },
    })
);
app.set('view engine', '.hbs');
// Middleware

// change session option based on environment
if(app.get('env') === 'production'){
    sessionOptions.proxy = true
    sessionOptions.cookie.secure = true
}
app.use(session(sessionOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(csrf());
// app.use(helmet());
app.use(compression());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
localStrategy(passport);
googleStrategy(passport);

app.use((req, res, next) => {
    res.locals.loggedInUser = req?.user ? req.user : null;
    res.locals.isAdmin = req?.user?.role === 1;
    res.locals.firstName = req?.user ? req.user.firstName : null;
    res.locals.csrfToken = req.csrfToken();
    // eslint-disable-next-line no-underscore-dangle
    res.locals.loggedInUserId = req?.user ? req.user._id : null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error = req.flash('error');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// auth
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/ideas', ideasRoutes);
app.use('/categories', categoryRoutes);
app.use('/ideas/:id/comments', commentRoutes);
app.use('/', indexRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Server listening
const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});
