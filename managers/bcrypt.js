const bcrypt = require('bcrypt');

class Bcrypt {
    async hash(password) {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    async compare(password, hash) {
        return bcrypt.compare(password, hash);
    }
}


module.exports = new Bcrypt;