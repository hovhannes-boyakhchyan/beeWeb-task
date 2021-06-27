const express = require('express');
const router = express.Router();
const responseHandler = require('../middleware/responseHandler');
const upload = require('../middleware/upload');
const validateToken = require('../middleware/validateToken');
const UploadCtrl = require('../controllers/upload-ctrl');


router.patch(
    '/avatar',
    validateToken,
    responseHandler,
    upload.single('avatar'),
    async (req, res) => {
        try {
            const user = await UploadCtrl.avatar(
                {
                    userId: req.decode.userId,
                    file: req.file?.filename
                }
            );
            res.onSuccess(user);
        } catch (e) {
            res.onError(e);
        }
    }
)



module.exports = router;