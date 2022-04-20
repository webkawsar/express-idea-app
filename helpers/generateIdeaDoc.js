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
    createdAt,
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
    createdAt,
    updatedAt,
    user,
});

module.exports = generateIdeaDoc;
