const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Channel = new Schema({
    forWorkspace: { type: Schema.Types.ObjectId, ref: "workspaces" },
    name: String,
    socketRoom: Object
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('channel', Channel);