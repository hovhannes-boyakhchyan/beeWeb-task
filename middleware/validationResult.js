const { validationResult } = require('express-validator');
const AppError = require('../managers/app_error');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.onError(new AppError("validation error", 403), { errors: errors.array() });
    }
    next();
}