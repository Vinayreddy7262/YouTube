// server/routes/channels.js
const express = require('express');
const router = express.Router();
const {
  createChannel,
  getChannelById,
  getUserChannel,
  updateChannel,
  getChannelVideos,
} = require('../controllers/channelController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, createChannel);
router.route('/user').get(protect, getUserChannel);
router.route('/:id').get(getChannelById).put(protect, updateChannel);
router.route('/:id/videos').get(getChannelVideos);

module.exports = router;