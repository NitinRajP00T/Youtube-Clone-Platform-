const express = require('express');
const videoController = require('../controllers/videoController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', videoController.getAllVideos);
router.get('/:videoId', videoController.getVideo);

router.post('/', protect, videoController.createVideo);
router.put('/:videoId', protect, videoController.updateVideo);
router.delete('/:videoId', protect, videoController.deleteVideo);

router.post('/:videoId/like', protect, videoController.likeVideo);
router.post('/:videoId/dislike', protect, videoController.dislikeVideo);

module.exports = router;
