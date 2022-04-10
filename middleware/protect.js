const protect = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error_msg', 'Please login to perform the action');
        res.redirect('/auth/login');
    }
};

module.exports = protect;
