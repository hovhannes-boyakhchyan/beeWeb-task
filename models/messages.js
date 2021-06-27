const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Message = new Schema({
    channel: { type: ObjectId, ref: 'channels' },
    message: String,
    image: String
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('Messages', Message);