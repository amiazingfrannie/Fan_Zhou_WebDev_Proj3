const mongoose = require("mongoose")

const UserSchema = require('./user.schema').UserSchema

const UserModel = mongoose.model("UserSchema", UserSchema);

function insertUser(user) {
    return UserModel.create(user);
}

function getUserByUsername(username) {
    return UserModel.findOne({username: username}).exec();
}

// User1 - p: 1234 - createdDate: 12/05
// User2 - p: 2345 - createdDate: 12/05
// User3 - p: 3456 - createdDate: 12/01
// UserModel.find({p: 1234, createdDate: '12/05'}).exec()

module.exports = {
    insertUser,
    getUserByUsername,
};