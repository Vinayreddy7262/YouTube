// server/models/Channel.js
const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  channelBanner: {
    type: String,
    default: 'https://i.ibb.co/7bQQYkX/banner.jpg'
  },
  subscribers: {
    type: Number,
    default: 0
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Channel', ChannelSchema);