// server/routes/comments.js
const express = require('express');
const router = express.Router();
const {
  addComment,
  getVideoComments,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, addComment);
router.route('/:videoId').get(getVideoComments);
router.route('/:id').put(protect, updateComment).delete(protect, deleteComment);

module.exports = router;