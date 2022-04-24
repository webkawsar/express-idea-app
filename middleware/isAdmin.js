const isAdmin = (req, res, next) => {
    if (req.user.role === 1) {
        next();
    } else {
        req.flash('error_msg', 'You are not allowed to perform the action');
        res.redirect('back');
    }
};

module.exports = isAdmin;
