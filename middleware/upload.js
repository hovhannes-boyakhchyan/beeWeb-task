const multer = require('multer');
const mime = require('mime-types');

const upload = multer({ dest: 'uploads/images' });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + "." + mime.extension(file.mimetype));
    }
})
module.exports = multer({ storage: storage });