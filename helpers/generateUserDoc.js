/* eslint-disable prettier/prettier */
const generateUserDoc = ({
 _id, firstName, lastName, email, createdAt, updatedAt, image, imageURL,
}) => ({
    _id,
    firstName,
    lastName,
    email,
    createdAt,
    updatedAt,
    image,
    imageURL,
});

module.exports = generateUserDoc;
