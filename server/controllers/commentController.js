// server/controllers/commentController.js
const Comment = require('../models/Comment');
const Video = require('../models/Video');
const mongoose = require('mongoose');

// @desc    Add a comment
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;

    // Check for required fields
    if (!videoId || !text) {
      return res.status(400).json({ message: 'VideoId and text are required' });
    }

    // Verify user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Log the videoId to check its format
    console.log('Attempting to add comment to video:', videoId);
    console.log('User ID:', req.user._id);

    // Check if videoId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: 'Invalid video ID format' });
    }

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const comment = await Comment.create({
      videoId,
      userId: req.user._id,
      text,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'userId',
      'username avatar'
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message  // Include the specific error message
    });
  }
};

// @desc    Get comments for a video
// @route   GET /api/comments/:videoId
// @access  Public
const getVideoComments = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    
    // Check if videoId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: 'Invalid video ID format' });
    }
    
    const comments = await Comment.find({ videoId })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message
    });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    
    // Check if commentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: 'Invalid comment ID format' });
    }
    
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    comment.text = req.body.text;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate(
      'userId',
      'username avatar'
    );

    res.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message
    });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    
    // Check if commentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: 'Invalid comment ID format' });
    }
    
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Using deleteOne instead of remove (which is deprecated)
    await Comment.deleteOne({ _id: commentId });

    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message
    });
  }
};

module.exports = {
  addComment,
  getVideoComments,
  updateComment,
  deleteComment,
};