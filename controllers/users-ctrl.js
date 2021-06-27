const bcrypt = require('../managers/bcrypt');
const Users = require('../models/users');
const AppError = require('../managers/app_error');


class UsersCtrl {
    async add(data) {
        const { name, surname, email, password, image } = data;
        if (await Users.exists({ email })) {
            throw new AppError('user exist', 404);
        }
        return new Users({
            name,
            surname,
            email,
            password: await bcrypt.hash(password),
            image: image?.imagename
        }).save();
    }
    async update(options) {
        const { name, surname, id } = options;

        if (!await Users.exists({ _id: id })) {
            throw new Apperror('user not found', 403);
        }
        const user = await Users.findById(id);
        user.name = name;
        user.surname = surname;

        user.save();
        return user;
    }
    async getById(id) {
        if (!await Users.exists({ _id: id })) {
            throw new AppError('user not found', 403);
        }
        return Users.findById(id);
    }
    async getOne(email) {
        if (!await Users.exists({ email: email })) {
            throw new AppError('this email not registered', 404);
        }
        return Users.findOne({ email: email });
    }
    async delete(id) {
        if (!await Users.exists({ _id: id })) {
            throw new AppError('user not found', 403);
        }
        return Users.findById(id).remove();
    }
}


module.exports = new UsersCtrl;
