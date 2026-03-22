const express = require('express');
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/multer');

const router = express.Router();

// Route for uploading a file (video or image)
router.post('/', protect, upload.single('file'), uploadController.uploadFile);

module.exports = router;
