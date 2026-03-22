const Comment = require('../models/Comment');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.addComment = catchAsync(async (req, res, next) => {
    // If mounted via video router, req.params.videoId will be available
    const videoId = req.params.videoId || req.body.video;

    if (!videoId) {
        return next(new AppError('Video ID is required to add a comment', 400));
    }

    const newComment = await Comment.create({
        text: req.body.text,
        user: req.user.id,
        video: videoId
    });

    await newComment.populate('user', 'username channel');

    res.status(201).json({
        status: 'success',
        data: {
            comment: newComment
        }
    });
});

exports.getCommentsForVideo = catchAsync(async (req, res, next) => {
    const videoId = req.params.videoId;
    if (!videoId) return next(new AppError('Video ID is required', 400));

    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ video: videoId })
        .populate('user', 'username channel')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Comment.countDocuments({ video: videoId });

    res.status(200).json({
        status: 'success',
        results: comments.length,
        total,
        data: {
            comments
        }
    });
});

exports.editComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return next(new AppError('No comment found with that ID', 404));

    if (comment.user.toString() !== req.user.id) {
        return next(new AppError('You can only edit your own comments', 403));
    }

    const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, { text: req.body.text }, {
        new: true,
        runValidators: true
    }).populate('user', 'username channel');

    res.status(200).json({
        status: 'success',
        data: {
            comment: updatedComment
        }
    });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return next(new AppError('No comment found with that ID', 404));

    if (comment.user.toString() !== req.user.id) {
        return next(new AppError('You can only delete your own comments', 403));
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(204).json({
        status: 'success',
        data: null
    });
});
