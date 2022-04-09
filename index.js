const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const flash = require('connect-flash');
const { compareValues, truncateText } = require('./helpers');

// config
const { connectDB, databaseURL } = require('./config/db');
// routes
const ideasRoute = require('./routes/idea');
const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');

// middleware
const errorMiddleware = require('./middleware/errorMiddleware');
// require('./config/passport')(passport);
const localStrategy = require('./config/passport');

// Database connection
connectDB();

// App object
const app = express();

// app.engine('handlebars', exphbs);
app.engine('.hbs', exphbs({ extname: '.hbs', helpers: { compareValues, truncateText } }));
app.set('view engine', '.hbs');

// Middleware

app.use(
    session({
        secret: 'This is secret key',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: databaseURL }),
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

app.use((req, res, next) => {
    res.locals.user = req?.user ? req.user : null;
    res.locals.success_msg = req.flash('success_msg');
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));

// auth
app.use('/ideas', ideasRoute);
app.use('/auth', authRoute);
app.use('/', indexRoute);

// Error handling middleware
app.use(errorMiddleware);

// Server listening
app.listen(8080, () => {
    console.log('Server is listening on: 8080');
});
