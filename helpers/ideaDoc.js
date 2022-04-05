// Handle handlebars problem

const generateIdeaDoc = ({
 title, description, allowComments, status, _id 
}) => ({
    title,
    description,
    allowComments,
    status,
    _id,
});

module.exports = generateIdeaDoc;
