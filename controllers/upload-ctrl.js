const UserCtrl = require('../controllers/users-ctrl');
const fs = require('fs/promises');
const path = require('path');

class UserProfile {
    async avatar(data) {
        const user = await UserCtrl.getById(data.userId);
        if (user.image) {
            await fs.unlink(path.join(__homedir, 'uploads', 'images', user.image));
        }
        user.image = data.file;
        return user.save();
    }
}

module.exports = new UserProfile;