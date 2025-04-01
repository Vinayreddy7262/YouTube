// server/controllers/videoController.js
const Video = require('../models/Video');
const User = require('../models/User');
const Channel = require('../models/Channel');

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
const getVideos = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    const videos = await Video.find(query)
      .populate('channelId', 'channelName')
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get video by ID
// @route   GET /api/videos/:id
// @access  Public
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('channelId', 'channelName channelBanner subscribers')
      .populate('uploader', 'username avatar');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment views
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a video
// @route   POST /api/videos
// @access  Private
const createVideo = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, videoUrl, category, isLive, duration } = req.body;

    // Get user's channel
    const channel = await Channel.findOne({ owner: req.user._id });

    if (!channel) {
      return res.status(404).json({ message: 'Create a channel first' });
    }

    const video = await Video.create({
      title,
      description,
      thumbnailUrl,
      videoUrl,
      category,
      isLive,
      duration,
      channelId: channel._id,
      uploader: req.user._id,
    });

    // Add video to channel
    channel.videos.push(video._id);
    await channel.save();

    res.status(201).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a video
// @route   PUT /api/videos/:id
// @access  Private
const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check ownership
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedVideo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check ownership
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Remove video from channel
    await Channel.updateOne(
      { _id: video.channelId },
      { $pull: { videos: video._id } }
    );

    await video.remove();

    res.json({ message: 'Video removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Like a video
// @route   PUT /api/videos/:id/like
// @access  Private
const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment likes
    video.likes += 1;
    await video.save();

    res.json({ likes: video.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Dislike a video
// @route   PUT /api/videos/:id/dislike
// @access  Private
const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment dislikes
    video.dislikes += 1;
    await video.save();

    res.json({ dislikes: video.dislikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get related videos
// @route   GET /api/videos/:id/related
// @access  Public
const getRelatedVideos = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Find videos with the same category, excluding the current video
    const relatedVideos = await Video.find({
      category: video.category,
      _id: { $ne: video._id },
    })
      .populate('channelId', 'channelName')
      .limit(10);

    res.json(relatedVideos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  getRelatedVideos,
};