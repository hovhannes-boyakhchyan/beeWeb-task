const jwt = require('jsonwebtoken');
const { privateKey } = require('../configs/privateKey');

class TokenManager {
    encode(data) {
        return jwt.sign(data, privateKey, { expiresIn: 60 * 60 * 12 });
    }
    decode(token) {
        return jwt.verify(token, privateKey);
    }
}

module.exports = new TokenManager;

