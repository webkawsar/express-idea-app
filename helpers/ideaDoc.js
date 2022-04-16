// Handle handlebars problem

// eslint-disable-next-line prettier/prettier
const generateIdeaDoc = ({
    title,
    description,
    allowComments,
    status,
    _id,
    comments,
    tags,
    updatedAt,
    user,
}) => ({
    title,
    description,
    allowComments,
    status,
    _id,
    comments,
    tags,
    updatedAt,
    user,
});

module.exports = generateIdeaDoc;
