const express = require('express');
const AuthCtrl = require('../controllers/auth-ctrl');
const UsersCtrl = require('../controllers/users-ctrl');
const { body } = require('express-validator');
const validationResult = require('../middleware/validationResult');
const responseHandler = require('../middleware/responseHandler');
const validateToken = require('../middleware/validateToken');

const router = express.Router();

router.post(
    '/register',
    body('name').exists().isLength({ min: 1 }),
    body('surname').exists().isLength({ min: 1 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    responseHandler,
    validationResult,
    async (req, res) => {
        try {
            const user = await AuthCtrl.register(req.body);
            res.onSuccess(user, "user created");
        } catch (e) {
            res.onError(e);
        }
    }
)
router.post(
    '/login',
    responseHandler,
    body('email').exists().isEmail(),
    body('password').exists(),
    validationResult,

    async (req, res) => {
        try {
            const token = await AuthCtrl.login(req.body);
            res.onSuccess(token);
        } catch (e) {
            res.onError(e);
        }
    }
)
router.post(
    '/activate',
    responseHandler,
    body('token').exists(),
    validationResult,

    async (req, res) => {
        try {
            await AuthCtrl.activate(req.body.token);
            res.onSuccess();
        } catch (e) {
            res.onError(e);
        }
    }
)
router.post(
    '/forgot-pass/',
    responseHandler,
    body('email').isEmail(),
    validationResult,

    async (req, res) => {
        try {
            const { email } = req.body;
            const answer = await AuthCtrl.forgotPass(email);
            res.onSuccess(answer);
        } catch (e) {
            res.onError(e);
        }
    }
)
router.post(
    '/new-pass/',
    responseHandler,
    body('password').isLength({ min: 6 }),
    validationResult,

    async (req, res) => {
        try {
            const { password, token } = req.body;
            const answer = await AuthCtrl.newPass({ password, token });
            res.onSuccess(answer, 'Password changed');
        } catch (e) {
            res.onError(e);
        }
    }
)
router.post(
    '/init-session',
    responseHandler,
    validateToken,

    async (req, res) => {
        try {
            const user = await UsersCtrl.getById(req.decode.userId);
            res.onSuccess(user, 'init-session');
        } catch (e) {
            res.onError(e);
        }
    }
)

module.exports = router;