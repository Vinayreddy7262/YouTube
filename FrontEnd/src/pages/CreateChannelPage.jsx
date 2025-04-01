// client/src/pages/CreateChannelPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import '../styles/CreateChannelPage.css';

const CreateChannelPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [channelBanner, setChannelBanner] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!channelName) {
      setError('Channel name is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const { data } = await axios.post('/api/channels', {
        channelName,
        description,
        channelBanner: channelBanner || 'https://via.placeholder.com/1200x200',
      });
      
      navigate(`/channel/${data._id}`);
    } catch (error) {
      console.error('Error creating channel:', error);
      setError(error.response?.data?.message || 'Failed to create channel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-channel-page">
      <div className="create-channel-container">
        <h1>Create Your Channel</h1>
        <p className="subtitle">Your channel is where you'll upload videos and engage with the community.</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="create-channel-form" onSubmit={handleSubmit}>
          <div className="form-preview">
            <h2>How you'll appear</h2>
            <div className="preview-container">
              <img 
                src={currentUser?.avatar || 'https://via.placeholder.com/120'} 
                alt="Profile" 
                className="preview-avatar"
              />
              <div className="preview-info">
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="Channel name"
                  className="preview-name-input"
                  maxLength="50"
                />
                <p className="preview-handle">@{channelName ? channelName.toLowerCase().replace(/\s+/g, '') : 'channelhandle'}</p>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your channel"
              rows="4"
              maxLength="1000"
            ></textarea>
            <p className="char-count">{description.length}/1000</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="banner">Channel Banner URL (optional)</label>
            <input
              type="text"
              id="banner"
              value={channelBanner}
              onChange={(e) => setChannelBanner(e.target.value)}
              placeholder="https://example.com/your-banner-image.jpg"
            />
            <p className="field-hint">Recommended banner size: 2048 x 1152 pixels</p>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Channel'}
            </button>
          </div>
          
          <p className="terms-notice">
            By clicking Create Channel you agree to YouTube's Terms of Service. Changes made to your name and
            profile picture are visible only on YouTube and not other Google services.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateChannelPage;