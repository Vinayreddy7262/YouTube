// server/controllers/channelController.js
const Channel = require('../models/Channel');
const User = require('../models/User');
const Video = require('../models/Video');

// @desc    Create a channel
// @route   POST /api/channels
// @access  Private
const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    // Check if user already has a channel
    const existingChannel = await Channel.findOne({ owner: req.user._id });

    if (existingChannel) {
      return res.status(400).json({ message: 'User already has a channel' });
    }

    const channel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: req.user._id,
    });

    // Add channel to user's channels
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { channels: channel._id } }
    );

    res.status(201).json(channel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get channel by ID
// @route   GET /api/channels/:id
// @access  Public
const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate('videos');

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's channel
// @route   GET /api/channels/user
// @access  Private
const getUserChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user._id })
      .populate('videos');

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update channel
// @route   PUT /api/channels/:id
// @access  Private
const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check ownership
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedChannel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get channel videos
// @route   GET /api/channels/:id/videos
// @access  Public
const getChannelVideos = async (req, res) => {
  try {
    const videos = await Video.find({ channelId: req.params.id })
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createChannel,
  getChannelById,
  getUserChannel,
  updateChannel,
  getChannelVideos,
};