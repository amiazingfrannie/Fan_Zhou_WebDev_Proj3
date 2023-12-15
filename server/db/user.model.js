const mongoose = require("mongoose")

const UserSchema = require('./user.schema').UserSchema

const UserModel = mongoose.model("UserSchema", UserSchema);

function insertUser(user) {
    return UserModel.create(user);
}

function getUserByUsername(username) {
    // console.log(username)
    return UserModel.findOne({username: username}).exec();
}

function updateUserBio(username, bio) {
    return UserModel.findOneAndUpdate(
        { username: username },
        { $set: { bio: bio } },
        { new: true } 
    ).exec();
}


module.exports = {
    insertUser,
    getUserByUsername,
    updateUserBio
};