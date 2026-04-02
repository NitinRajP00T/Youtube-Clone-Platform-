const express = require("express");
const channelController = require("../controllers/channelController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, channelController.createChannel);
router.get("/:channelId", channelController.getChannel);
router.put("/:channelId", protect, channelController.updateChannel);
router.get("/user/:userId", channelController.getChannelByUserId);

module.exports = router;
