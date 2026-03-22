const Video = require('../models/Video');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const s3Service = require('../services/s3Service');

exports.createVideo = catchAsync(async (req, res, next) => {
    if (!req.body.channel) req.body.channel = req.user.channel;
    
    if (!req.body.channel) {
        return next(new AppError('You must have a channel to upload a video', 400));
    }

    const newVideo = await Video.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            video: newVideo
        }
    });
});

exports.getAllVideos = catchAsync(async (req, res, next) => {
    const { search, category, page = 1, limit = 10 } = req.query;

    const queryObj = {};
    if (search) {
        queryObj.title = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
        queryObj.category = category;
    }

    const skip = (page - 1) * limit;

    const videos = await Video.find(queryObj)
        .populate('channel', 'channelName banner owner')
        .skip(skip)
        .limit(parseInt(limit))
        .sort('-createdAt');

    const total = await Video.countDocuments(queryObj);

    res.status(200).json({
        status: 'success',
        results: videos.length,
        total,
        data: {
            videos
        }
    });
});

exports.getVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findById(req.params.videoId)
        .populate('channel', 'channelName banner owner subscribers');
    
    if (!video) {
        return next(new AppError('No video found with that ID', 404));
    }

    // Increment views
    video.views += 1;
    await video.save({ validateBeforeSave: false });

    // Populate counts for likes and dislikes
    const videoData = video.toObject();
    videoData.likesCount = video.likes.length;
    videoData.dislikesCount = video.dislikes.length;

    res.status(200).json({
        status: 'success',
        data: {
            video: videoData
        }
    });
});

exports.updateVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findById(req.params.videoId).populate('channel');

    if (!video) {
        return next(new AppError('No video found with that ID', 404));
    }

    if (video.channel.owner.toString() !== req.user.id) {
        return next(new AppError('You do not have permission to update this video', 403));
    }

    const updatedVideo = await Video.findByIdAndUpdate(req.params.videoId, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            video: updatedVideo
        }
    });
});

exports.deleteVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findById(req.params.videoId).populate('channel');

    if (!video) {
        return next(new AppError('No video found with that ID', 404));
    }

    if (video.channel.owner.toString() !== req.user.id) {
        return next(new AppError('You do not have permission to delete this video', 403));
    }

    await s3Service.deleteFile(video.videoUrl);
    await s3Service.deleteFile(video.thumbnailUrl);

    await Video.findByIdAndDelete(req.params.videoId);

    // Also delete associated comments
    const Comment = require('../models/Comment');
    await Comment.deleteMany({ video: req.params.videoId });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.likeVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findById(req.params.videoId);

    if (!video) return next(new AppError('No video found', 404));

    // Remove from dislikes if present
    const dislikeIndex = video.dislikes.indexOf(req.user.id);
    if (dislikeIndex !== -1) {
        video.dislikes.splice(dislikeIndex, 1);
    }

    // Toggle like
    const likeIndex = video.likes.indexOf(req.user.id);
    if (likeIndex === -1) {
        video.likes.push(req.user.id);
    } else {
        video.likes.splice(likeIndex, 1);
    }

    await video.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        data: {
            likesCount: video.likes.length,
            dislikesCount: video.dislikes.length
        }
    });
});

exports.dislikeVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findById(req.params.videoId);

    if (!video) return next(new AppError('No video found', 404));

    // Remove from likes if present
    const likeIndex = video.likes.indexOf(req.user.id);
    if (likeIndex !== -1) {
        video.likes.splice(likeIndex, 1);
    }

    // Toggle dislike
    const dislikeIndex = video.dislikes.indexOf(req.user.id);
    if (dislikeIndex === -1) {
        video.dislikes.push(req.user.id);
    } else {
        video.dislikes.splice(dislikeIndex, 1);
    }

    await video.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        data: {
            likesCount: video.likes.length,
            dislikesCount: video.dislikes.length
        }
    });
});
