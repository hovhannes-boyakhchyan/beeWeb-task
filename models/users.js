const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    verify: { type: Boolean, default: false },
    name: String,
    surname: String,
    image: String,
    email: String,
    password: String,
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('users', User);