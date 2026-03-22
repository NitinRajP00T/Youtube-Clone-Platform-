const express = require('express');
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.get('/', commentController.getCommentsForVideo);
router.post('/', protect, commentController.addComment);

router.put('/:commentId', protect, commentController.editComment);
router.delete('/:commentId', protect, commentController.deleteComment);

module.exports = router;
