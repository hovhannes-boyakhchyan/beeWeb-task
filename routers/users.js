const express = require('express');
const UsersCtrl = require('../controllers/users-ctrl');
const upload = require('../middleware/upload');
const { body } = require('express-validator');
const validationResult = require('../middleware/validationResult');
const responseHandler = require('../middleware/responseHandler');
const validateToken = require('../middleware/validateToken');


const router = express.Router();

router.route("/")
    .get(
        responseHandler,
        validateToken,
        async (req, res) => {
            const searchValues = req.query.search.split(' ').map(item => new RegExp(item, 'i'));
            try {
                const users = await UsersCtrl.getAll({ search: searchValues, currentUserId: req.decode.userId });
                res.onSuccess(users);
            } catch (e) {
                res.onError(e);
            }
        }
    )
    .post(
        upload.single('avatar'),
        body('name').exists(),
        body('surname').exists(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 }),
        responseHandler,
        validationResult,
        async (req, res) => {
            try {
                const user = await UsersCtrl.add({ ...req.body, image: req.file });
                res.onSuccess(user, "user created");
            } catch (e) {
                res.onError(e);
            }

        }
    )

router.route('/:id')
    .get(
        validateToken,
        responseHandler,
        async (req, res) => {
            try {
                const user = await UsersCtrl.getById(req.params.id);
                res.onSuccess(user);
            } catch (e) {
                res.onError(e);
            }
        }
    )
    .put(
        responseHandler,
        async (req, res) => {
            try {
                const { name, surname } = req.body;
                const user = await UsersCtrl.update({ name, surname, id: req.params.id });
                res.onSuccess(user, "user edited");
            } catch (e) {
                res.onError(e);
            }
        }
    )
    .delete(
        responseHandler,
        async (req, res) => {
            try {
                const user = await UsersCtrl.delete(req.params.id);
                res.onSuccess(user, 'user was deleted');
            } catch (e) {
                res.onError(e);
            }
        }
    )


router.route('/:id/friend-request')
    .post(
        responseHandler,
        validateToken,
        async (req, res) => {
            try {
                const data = await UsersCtrl.frinedRequest({ currentUserId: req.decode.userId, userId: req.params.id });
                res.onSuccess('', data.message);
            } catch (e) {
                res.onError(e);
            }
        }
    )

module.exports = router;