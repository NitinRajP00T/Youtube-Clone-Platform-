const Channel = require('../models/Channel');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createChannel = catchAsync(async (req, res, next) => {
    // Check if user already has a channel
    const existingChannel = await Channel.findOne({ owner: req.user.id });
    if (existingChannel) {
        return next(new AppError('You already have a channel', 400));
    }

    const newChannel = await Channel.create({
        channelName: req.body.channelName,
        description: req.body.description,
        banner: req.body.banner,
        owner: req.user.id
    });

    // Update user to reference this channel
    await User.findByIdAndUpdate(req.user.id, { channel: newChannel._id });

    res.status(201).json({
        status: 'success',
        data: {
            channel: newChannel
        }
    });
});

exports.getChannel = catchAsync(async (req, res, next) => {
    const channel = await Channel.findById(req.params.channelId)
        .populate('owner', 'username email');

    if (!channel) {
        return next(new AppError('No channel found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            channel
        }
    });
});

exports.updateChannel = catchAsync(async (req, res, next) => {
    const channel = await Channel.findById(req.params.channelId);

    if (!channel) {
        return next(new AppError('No channel found with that ID', 404));
    }

    if (channel.owner.toString() !== req.user.id) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }

    const updatedChannel = await Channel.findByIdAndUpdate(req.params.channelId, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            channel: updatedChannel
        }
    });
});

exports.getChannelByUserId = catchAsync(async (req, res, next) => {
    const channel = await Channel.findOne({ owner: req.params.userId })
        .populate('owner', 'username email');

    if (!channel) {
        return next(new AppError('No channel found for this user', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            channel
        }
    });
});
