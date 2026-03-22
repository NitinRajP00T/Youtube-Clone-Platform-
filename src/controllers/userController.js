const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getUserProfile = catchAsync(async (req, res, next) => {
    // Return public profile info
    const user = await User.findById(req.params.userId).select('-password').populate('channel');
    
    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
