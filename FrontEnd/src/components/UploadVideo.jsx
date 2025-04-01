// client/src/components/UploadVideo.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import '../styles/UploadVideo.css';

const UploadVideo = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [isLive, setIsLive] = useState(false);
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Entertainment', 'Music', 'Sports', 'Gaming', 'Education',
    'Technology', 'Travel', 'Comedy', 'News'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !videoUrl || !thumbnailUrl) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { data } = await axios.post('/api/videos', {
        title,
        description,
        thumbnailUrl,
        videoUrl,
        category,
        isLive,
        duration: duration || '0:00',
      });

      // Reset form after successful upload
      setTitle('');
      setDescription('');
      setThumbnailUrl('');
      setVideoUrl('');
      setCategory('Entertainment');
      setIsLive(false);
      setDuration('');

      navigate(`/video/${data._id}`);
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(error.response?.data?.message || 'Failed to upload video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-video-container">
      <h1>Upload Video</h1>

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button className="close-error" onClick={() => setError('')}>
            ×
          </button>
        </div>
      )}

      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your video"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="thumbnailUrl">Thumbnail URL *</label>
          <input
            type="url"
            id="thumbnailUrl"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="e.g., https://example.com/thumbnail.jpg"
            required
          />
          {thumbnailUrl && (
            <div className="thumbnail-preview">
              <img
                src={thumbnailUrl}
                alt="Thumbnail preview"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL')}
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="videoUrl">Video URL *</label>
          <input
            type="url"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="e.g., https://example.com/video.mp4"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group half-width">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 10:30"
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="isLive"
            checked={isLive}
            onChange={(e) => setIsLive(e.target.checked)}
          />
          <label htmlFor="isLive">Live Stream</label>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Uploading...
              </>
            ) : (
              'Upload Video'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadVideo;