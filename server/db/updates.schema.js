const Schema = require('mongoose').Schema;

const CommentSchema = new Schema({
    username: String,
    content: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

exports.UpdatesSchema = new Schema({
    username: {
        type: String,
    },
    context: String,
    createdTime: {
        type: Date,
        default: Date.now,
    },
    modifiedTime: {
        type: Date,
        default: null,
    },
    likes: {
        type: Number,
        default: 0
    },
    retweet: {
        type: Number,
        default: 0
    },
    comments: [CommentSchema]
}, { collection : 'updatesTable' });
