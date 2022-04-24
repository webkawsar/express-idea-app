// eslint-disable-next-line object-curly-newline
const generateCategoryDoc = ({ _id, category, createdAt, updatedAt }) => ({
    _id,
    category,
    createdAt,
    updatedAt,
});

module.exports = generateCategoryDoc;
