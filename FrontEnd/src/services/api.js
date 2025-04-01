// client/src/services/api.js
import axios from 'axios';

// Video services
export const fetchVideos = async (params = {}) => {
  const { data } = await axios.get('/api/videos', { params });
  return data;
};

export const fetchVideoById = async (id) => {
  const { data } = await axios.get(`/api/videos/${id}`);
  return data;
};

export const fetchRelatedVideos = async (id) => {
  const { data } = await axios.get(`/api/videos/${id}/related`);
  return data;
};

export const likeVideo = async (id) => {
  const { data } = await axios.put(`/api/videos/${id}/like`);
  return data;
};

export const dislikeVideo = async (id) => {
  const { data } = await axios.put(`/api/videos/${id}/dislike`);
  return data;
};

// Comment services
export const fetchComments = async (videoId) => {
  const { data } = await axios.get(`/api/comments/${videoId}`);
  return data;
};

export const addComment = async (comment) => {
  const { data } = await axios.post('/api/comments', comment);
  return data;
};

export const updateComment = async (id, text) => {
  const { data } = await axios.put(`/api/comments/${id}`, { text });
  return data;
};

export const deleteComment = async (id) => {
  await axios.delete(`/api/comments/${id}`);
};

// Channel services
export const createChannel = async (channelData) => {
  const { data } = await axios.post('/api/channels', channelData);
  return data;
};

export const fetchChannelById = async (id) => {
  const { data } = await axios.get(`/api/channels/${id}`);
  return data;
};

export const fetchUserChannel = async () => {
  const { data } = await axios.get('/api/channels/user');
  return data;
};

export const fetchChannelVideos = async (id) => {
  const { data } = await axios.get(`/api/channels/${id}/videos`);
  return data;
};

export const updateChannel = async (id, channelData) => {
  const { data } = await axios.put(`/api/channels/${id}`, channelData);
  return data;
};