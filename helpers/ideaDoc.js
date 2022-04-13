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
}) => ({
    title,
    description,
    allowComments,
    status,
    _id,
    comments,
    tags,
    updatedAt,
});

module.exports = generateIdeaDoc;
