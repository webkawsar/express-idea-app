/* eslint-disable prettier/prettier */
const generateUserDoc = ({
 _id, firstName, lastName, email, createdAt, updatedAt,
}) => ({
    _id,
    firstName,
    lastName,
    email,
    createdAt,
    updatedAt,
});

module.exports = generateUserDoc;
