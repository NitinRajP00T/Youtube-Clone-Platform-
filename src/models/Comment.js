const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'A comment cannot be empty'],
        trim: true,
        maxlength: 500
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Comment must belong to a user']
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: [true, 'Comment must belong to a video']
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
