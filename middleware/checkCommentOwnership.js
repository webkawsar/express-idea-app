const Comment = require('../models/Comment');

// eslint-disable-next-line consistent-return
const checkCommentOwnership = async (req, res, next) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        req.flash('error_msg', 'Comment not found');
        return res.redirect('back');
    }

    // eslint-disable-next-line no-underscore-dangle
    if (!comment.user._id.equals(req.user._id)) {
        req.flash('error_msg', 'You are not allowed to perform the action');
        return res.redirect('back');
    }

    next();
};

module.exports = checkCommentOwnership;
