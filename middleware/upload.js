const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const jpeg = file.mimetype === 'image/jpeg';
    const jpg = file.mimetype === 'image/jpg';
    const png = file.mimetype === 'image/png';

    if (jpeg || jpg || png) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    // storage,
    // fileFilter,
    // limits: {
    //     fileSize: 1000000,
    // },
}).single('idea_img');

module.exports = upload;
