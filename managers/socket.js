const TokenManager = require('../managers/token_manager');
const MessageCtrl = require('../controllers/messages-ctrl');
const AppError = require('../managers/app_error');
const fs = require('fs');
const path = require('path');


const onlineUsers = new Map();
module.exports = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: '*'
        }
    });

    io.use((client, next) => {
        if (client.handshake.auth.token) {
            try {
                const decode = TokenManager.decode(client.handshake.auth.token);
                if (decode.userId && decode.action === 'login') {
                    client.userId = decode.userId;
                    next();
                } else {
                    client.disconnect();
                }
            } catch (e) {
                client.disconnect();
            }
        } else {
            client.disconnect();
        }
    });

    io.on('connection', client => {
        onlineUsers.set(client.userId, client);

        client.on('new message', async (data, cb) => {
            const messageData = {
                currentUser: client.userId,
                userTo: data.to,
                message: data.message ? data.message : undefined,
                image: undefined
            }
            if (data.file) {
                //upload image
                try {
                    const base64Data = data.file.replace(/^data:image\/(jpeg;|jpg;|png;|gif;)base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    let imageName = `msgImage-${Date.now()}.png`;
                    const writeStream = fs.createWriteStream(path.join(__homedir, 'uploads', 'images', imageName));
                    writeStream.write(buffer);
                    messageData.image = imageName;
                } catch (e) {
                    throw new AppError('image not uploaded', 401);
                }
            }
            const message = await MessageCtrl.send(messageData);
            cb({ status: "ok" });

            if (onlineUsers.has(data.to)) {
                const user = onlineUsers.get(data.to);
                user.emit('new message', message);
            }
        });

        client.on('get all messages', async (userId) => {
            const messages = await MessageCtrl.getMessages({
                currentUser: client.userId,
                userTo: userId
            });
            client.emit('get all messages', messages);
        });

        client.on('getUsersChatList', async (currentUserId) => {
            const inChatUsers = new Set();
            const usersId = await MessageCtrl.getUsersFromMessages(currentUserId);
            usersId.forEach(user => {
                if (user.from['_id'] != currentUserId) {
                    inChatUsers.add(JSON.stringify(user.from));
                } else if (user.to['_id'] != currentUserId) {
                    inChatUsers.add(JSON.stringify(user.to));
                }
            });
            client.emit('getUsersChatList', [...inChatUsers]);
        });

        client.on('disconnect', () => {
            onlineUsers.delete(client.userId);
        });
    });
}