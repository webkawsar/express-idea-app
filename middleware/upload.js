const multer = require('multer');

const upload = multer({}).single('idea_img');

module.exports = upload;
