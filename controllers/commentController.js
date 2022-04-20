const mongoose = require('mongoose');
const Idea = require('../models/Idea');
const generateIdeaDoc = require('../helpers/generateIdeaDoc');
const { Comment } = require('../models/Comment');

/*
 * @params: id
 * @queryString:
 * @api: { GET } /ideas/:id/comments/new
 *
 */

// eslint-disable-next-line consistent-return
exports.new = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).render('notFound', { title: 'Not found' });
    }

    const idea = await Idea.findById(id);
    if (!idea) return res.status(404).render('notFound', { title: 'Not found' });

    res.render('comments/new', {
        title: 'Add a new comment',
        idea: generateIdeaDoc(idea),
    });
};

/*
 * @params: id
 * @queryString:
 * @api: { POST } /ideas/:id/comments
 *
 */

// eslint-disable-next-line consistent-return
exports.create = async (req, res) => {
    const { id } = req.params;
    const idea = await Idea.findById(id);
    if (!idea) return res.status(404).render('notFound', { title: 'Not found' });

    const comment = new Comment({
        ...req.body,
        idea: id,
        user: {
            _id: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
        },
    });
    await comment.save();

    // idea.comments.push(comment);
    // await idea.save();
    req.flash('success_msg', 'Added your comment in ideas');
    res.redirect(`/ideas/${id}`);
};

/*
 * @params:
 * @queryString:
 * @api: { DELETE } /
 *
 */
// eslint-disable-next-line consistent-return
exports.delete = async (req, res) => {
    const { id, commentId } = req.params;

    const idea = await Idea.findById(id);
    if (!idea) return res.status(404).render('notFound', { title: 'Not found' });

    // eslint-disable-next-line no-underscore-dangle
    // const comments = idea.comments.filter((comment) => comment._id.toString() !== commentId);
    // idea.comments = comments;
    // await idea.save();

    await Comment.findByIdAndDelete(commentId);
    req.flash('success_msg', 'Comment delete successfully');
    res.redirect(`/ideas/${id}`);
};
