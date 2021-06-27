const Messages = require('../models/messages');
const Users = require('../models/users');
const AppError = require('../managers/app_error');

class MessagesCtrl {
    async send(data) {
        const { currentUser, userTo } = Promise.all([await Users.findById(data.currentUser), await Users.findById(data.userTo)]);
        if (!currentUser || !userTo) {
            new AppError('user not found', 400);
        }
        return new Messages({
            from: data.currentUser,
            to: data.userTo,
            message: data.message,
            image: data.image
        }).save();
    }
    async getMessages(users) {
        const { sender, recipient } = users;
        const { currentUser, userTo } = Promise.all([await Users.findById(users.currentUser), await Users.findById(users.userTo)]);
        if (!currentUser || !userTo) {
            new AppError('user not found', 400);
        }
        return Messages.find({
            from: { $in: [users.currentUser, users.userTo] },
            to: { $in: [users.currentUser, users.userTo] }
        });
    }
    async getUsersFromMessages(currentUserId) {
        const currentUser = await Users.findById(currentUserId);
        if (!currentUser) {
            new AppError('user not found', 400);
        }
        return Messages.find({ $or: [{ from: currentUserId }, { to: currentUserId }] }).select('-_id from to createdAt').populate([
            {
                path: 'from',
                select: 'name surname image'
            },
            {
                path: 'to',
                select: 'name surname image'
            }
        ]);
    }
}

module.exports = new MessagesCtrl;