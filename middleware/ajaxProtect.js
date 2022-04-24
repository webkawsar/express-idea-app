const ajaxProtect = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(400).send({ success: false, message: 'Please login to perform the action' });
    }
};

module.exports = ajaxProtect;
