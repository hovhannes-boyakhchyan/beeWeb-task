const TokenManager = require('../managers/token_manager');
const AppError = require('../managers/app_error');

module.exports = (req, res, next) => {
    const token = req.headers['token'] || req.body['token'] || req.query['token'];
    if (token) {
        try {
            const decode = TokenManager.decode(token);
            if (decode.userId && decode.action === 'login') {
                req.decode = decode;
                next();
            } else {
                res.onError(new AppError('invalid token', 401));
            }
        } catch (e) {
            res.onError(new AppError('invalid token', 401));
        }
    } else {
        res.onError(new AppError('invalid token', 401));
    }
}