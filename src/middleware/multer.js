const multer = require('multer');

// Use memory storage to upload directly to S3
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit for videos and images
    }
});

module.exports = upload;
