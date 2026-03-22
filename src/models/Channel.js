const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: [true, 'A channel must have a name'],
        unique: true,
        trim: true,
        maxlength: 50
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A channel must belong to a user']
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    banner: {
        type: String,
        default: ''
    },
    subscribers: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Channel = mongoose.model('Channel', channelSchema);
module.exports = Channel;
