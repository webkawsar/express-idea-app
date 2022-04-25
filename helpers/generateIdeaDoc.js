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
    category,
    image,
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
    category,
    image,
});

module.exports = generateIdeaDoc;
