// server/models/Video.js
const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  duration: {
    type: String,
    default: '0:00'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    default: 'Entertainment'
  },
  isLive: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);