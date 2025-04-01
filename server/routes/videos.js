// server/routes/videos.js
const express = require('express');
const router = express.Router();
const {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  getRelatedVideos,
} = require('../controllers/videoController');
const { protect } = require('../middleware/auth');

router.route('/').get(getVideos).post(protect, createVideo);
router.route('/:id').get(getVideoById).put(protect, updateVideo).delete(protect, deleteVideo);
router.route('/:id/like').put(protect, likeVideo);
router.route('/:id/dislike').put(protect, dislikeVideo);
router.route('/:id/related').get(getRelatedVideos);

module.exports = router;