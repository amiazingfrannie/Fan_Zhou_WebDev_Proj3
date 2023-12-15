const mongoose = require("mongoose")

const UpdatesSchema = require('./updates.schema').UpdatesSchema

const UpdatesModel = mongoose.model("Updates", UpdatesSchema);

function insertUpdates(updates) {
    return UpdatesModel.create(updates);
}

function getAllUpdates() {
    return UpdatesModel.find().sort({createdTime: -1}).exec();
}

function findUpdatesByUsername(username) {
    return UpdatesModel.find({username: username}).sort({createdTime: -1}).exec();
}

function findUpdateById(id) {
    return UpdatesModel.findById(id).exec();
}

function findUpdateByIdAndDelete(id) {
    return UpdatesModel.findByIdAndDelete(id).exec();
}

function deleteByUsername(username) {
    return UpdatesModel.deleteMany({username: username}).exec();
}

function updatePost(_id, context) {
    return UpdatesModel.findOneAndUpdate(
        { _id: _id },
        { $set: { context: context } },
        { new: true } 
    ).exec();
}


module.exports = {
    insertUpdates,
    findUpdatesByUsername,
    getAllUpdates,
    findUpdateById,
    findUpdateByIdAndDelete,
    updatePost,
    deleteByUsername
};