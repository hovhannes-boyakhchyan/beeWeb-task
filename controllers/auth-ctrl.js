const UsersCtrl = require('../controllers/users-ctrl');
const Bcrypt = require('../managers/bcrypt');
const TokenManager = require('../managers/token_manager');
const AppError = require('../managers/app_error');


class AuthCtrl {
    async register(data) {
        const userAdd = await UsersCtrl.add(data);
        if (userAdd) {
            return TokenManager.encode({
                userId: userAdd['_id'],
                action: 'register'
            });
        }
    }

    async login(data) {
        const { email, password } = data;
        const user = await UsersCtrl.getOne(email);
        if (user && await Bcrypt.compare(password, user.password)) {
            if (user.verify) {
                return TokenManager.encode({
                    userId: user['_id'],
                    action: 'login'
                });
            } else {
                throw new AppError('Activate your profile', 401);
            }
        }
        throw new AppError('email or password is invalid', 401);
    }

    async activate(token) {
        const decode = TokenManager.decode(token);
        if (decode.userId && decode.action === 'register') {
            const user = await UsersCtrl.getById(decode.userId);
            if (user) {
                if (user.verify) {
                    throw new AppError('profil is active', 404);
                }
                user.verify = true;
                return user.save();
            }
        }
        throw new AppError('register token invalide', 401);
    }

    async forgotPass(email) {
        const user = await UsersCtrl.getOne(email);
        if (user) {
            const token = TokenManager.encode({
                userId: user['_id'],
                action: 'forgotPass'
            });
            user.forgotPass = token;
            await user.save();
            return token;
        }
    }

    async newPass(data) {
        const decode = TokenManager.decode(data.token);
        const user = await UsersCtrl.getById(decode.userId);

        if (user) {
            if (user.forgotPass === data.token) {
                user.password = await Bcrypt.hash(data.password);
                user.forgotPass = undefined;
                return user.save();
            } else {
                throw new AppError('Link invalid', 404);
            }

        }
    }
}

module.exports = new AuthCtrl;