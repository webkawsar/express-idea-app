// Handle handlebars problem

// eslint-disable-next-line prettier/prettier
const generateCommentDoc = ({
    title, text, _id, user, createdAt,
   }) => ({
    title,
    text,
    _id,
    user,
    createdAt,
});

module.exports = generateCommentDoc;
