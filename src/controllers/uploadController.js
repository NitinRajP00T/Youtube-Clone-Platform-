const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const s3Service = require('../services/s3Service');

exports.uploadFile = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload a file.', 400));
    }

    console.log('📁 Upload request received:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        hasBuffer: !!req.file.buffer,
        bufferLength: req.file.buffer?.length
    });

    // Determine folder based on file type
    const folder = req.file.mimetype.startsWith('video') ? 'videos' : 'images';

    // Upload to S3 — let errors propagate so we know the real issue
    const url = await s3Service.uploadFile(req.file, folder);

    console.log('✅ S3 Upload successful:', url);

    res.status(200).json({
        status: 'success',
        data: {
            url
        }
    });
});
