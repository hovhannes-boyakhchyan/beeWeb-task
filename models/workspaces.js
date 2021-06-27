const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Workspace = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "users" },
    name: String,
    channels: [{
        channelId: { type: Schema.Types.ObjectId, ref: 'channels' },
        name: String,
    }],
    members: [{
        memberId: { type: Schema.Types.ObjectId, ref: 'users' },
        name: String,
        surname: String,
        image: String
    }],
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('workspace', Workspace);