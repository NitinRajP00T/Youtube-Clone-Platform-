const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A video must have a title'],
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, 'A video must have a description']
    },
    videoUrl: {
        type: String,
        required: [true, 'A video must have a URL (S3)']
    },
    thumbnailUrl: {
        type: String,
        required: [true, 'A video must have a thumbnail URL']
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: [true, 'A video must belong to a channel']
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    category: {
        type: String,
        default: 'General'
    }
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
