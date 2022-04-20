const checkGuest = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/users/me/ideas');
    } else {
        next();
    }
};

module.exports = checkGuest;
