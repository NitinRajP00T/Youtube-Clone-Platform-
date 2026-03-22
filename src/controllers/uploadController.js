const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const s3Service = require('../services/s3Service');

exports.uploadFile = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload a file.', 400));
    }

    // Optionally determine folder based on file type
    const folder = req.file.mimetype.startsWith('video') ? 'videos' : 'images';
    
    let url;
    try {
        url = await s3Service.uploadFile(req.file, folder);
    } catch (error) {
        // Fallback for local development if S3 is not configured
        console.warn(`S3 Upload failed: ${error.message}. Returning mock URL.`);
        url = `http://localhost:5000/mock-${folder}/${req.file.originalname}`;
    }

    res.status(200).json({
        status: 'success',
        data: {
            url
        }
    });
});
