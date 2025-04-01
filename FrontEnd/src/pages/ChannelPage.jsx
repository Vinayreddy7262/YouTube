// client/src/pages/ChannelPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import VideoGrid from '../components/VideoGrid';
import AuthContext from '../context/AuthContext';
import { FaBell, FaEdit } from 'react-icons/fa';
import '../styles/ChannelPage.css';

const ChannelPage = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchChannel();
    fetchChannelVideos();
  }, [id]);

  useEffect(() => {
    if (channel && currentUser) {
      setIsOwner(channel.owner._id === currentUser._id);
    }
  }, [channel, currentUser]);

  const fetchChannel = async () => {
    try {
      // For the demo, check if this is the user's own channel
      if (id === 'user' && currentUser) {
        const { data } = await axios.get('/api/channels/user');
        setChannel(data);
        return;
      }
      
      const { data } = await axios.get(`/api/channels/${id}`);
      setChannel(data);
    } catch (error) {
      console.error('Error fetching channel:', error);
    }
  };

  const fetchChannelVideos = async () => {
    try {
      // If using sample data for demo
      let channelVideos = [];
      
      try {
        const response = await fetch('/sample-data.json');
        const allVideos = await response.json();
        
        // Filter videos by author/channel name
        if (channel) {
          channelVideos = allVideos.filter(v => v.channelId === id || v.author === channel.channelName);
        } else {
          // For initial load when channel might not be loaded yet
          channelVideos = allVideos.filter(v => v.channelId === id).slice(0, 8);
        }
        
        if (channelVideos.length > 0) {
          setVideos(channelVideos);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log('Using API fallback for channel videos');
      }
      
      // Fallback to API
      const { data } = await axios.get(`/api/channels/${id === 'user' && currentUser ? currentUser.channels[0] : id}/videos`);
      setVideos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading && !channel) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading channel...</p>
      </div>
    );
  }

  if (!channel && !loading) {
    return (
      <div className="channel-not-found">
        <h2>Channel not found</h2>
        <p>The channel you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="back-btn">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="channel-page">
      <div className="channel-banner">
        <img 
          src={channel?.channelBanner || 'https://via.placeholder.com/1200x200'} 
          alt={`${channel?.channelName} banner`} 
          className="banner-img"
        />
      </div>
      
      <div className="channel-info">
        <div className="channel-header">
          <img 
            src={channel?.owner?.avatar || 'https://via.placeholder.com/80'} 
            alt={channel?.channelName} 
            className="channel-avatar"
          />
          
          <div className="channel-details">
            <h1 className="channel-name">{channel?.channelName}</h1>
            <p className="subscriber-count">{channel?.subscribers || '0'} subscribers</p>
          </div>
          
          {isOwner ? (
            <Link to="/upload" className="manage-btn">
              <FaEdit />
              <span>Manage Videos</span>
            </Link>
          ) : (
            <button className="subscribe-btn">
              <FaBell />
              <span>Subscribe</span>
            </button>
          )}
        </div>
        
        <div className="channel-description">
          <p>{channel?.description || 'No description available'}</p>
        </div>
        
        <div className="channel-tabs">
          <button 
            className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => handleTabChange('videos')}
          >
            Videos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'playlists' ? 'active' : ''}`}
            onClick={() => handleTabChange('playlists')}
          >
            Playlists
          </button>
          <button 
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => handleTabChange('about')}
          >
            About
          </button>
        </div>
      </div>
      
      <div className="channel-content">
        {activeTab === 'videos' && (
          <>
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading videos...</p>
              </div>
            ) : (
              <>
                {videos.length === 0 ? (
                  <div className="no-videos">
                    <p>No videos found on this channel.</p>
                    {isOwner && (
                      <Link to="/upload" className="upload-btn">
                        Upload a video
                      </Link>
                    )}
                  </div>
                ) : (
                  <VideoGrid videos={videos} />
                )}
              </>
            )}
          </>
        )}
        
        {activeTab === 'playlists' && (
          <div className="playlists-container">
            <p>No playlists found.</p>
          </div>
        )}
        
        {activeTab === 'about' && (
          <div className="about-container">
            <div className="about-section">
              <h3>Description</h3>
              <p>{channel?.description || 'No description available'}</p>
            </div>
            
            <div className="about-section">
              <h3>Stats</h3>
              <p>Joined {new Date(channel?.createdAt).toLocaleDateString()}</p>
              <p>{channel?.subscribers || '0'} subscribers</p>
              <p>{videos.length} videos</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;