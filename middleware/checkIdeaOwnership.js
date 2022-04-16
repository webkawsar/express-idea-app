const Idea = require('../models/Idea');

// eslint-disable-next-line consistent-return
const checkIdeaOwnership = async (req, res, next) => {
    const { id } = req.params;
    const idea = await Idea.findById(id);
    if (!idea) {
        req.flash('error_msg', 'Idea not found');
        return res.redirect('back');
    }

    // eslint-disable-next-line no-underscore-dangle
    if (!idea.user._id.equals(req.user._id)) {
        req.flash('error_msg', 'You are not allowed to perform the action');
        return res.redirect('back');
    }

    next();
};

module.exports = checkIdeaOwnership;
