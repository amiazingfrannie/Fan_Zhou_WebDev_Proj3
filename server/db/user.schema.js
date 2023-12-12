const Schema = require('mongoose').Schema;

exports.UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    createdTime: {
        type: Date,
        default: Date.now,
    },
}, { collection : 'userTable' });

//Date.now()