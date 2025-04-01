// client/src/components/VideoCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import '../styles/VideoCard.css';

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <Link to={`/video/${video.id || video._id}`} className="thumbnail-container">
        <img src={video.thumbnailUrl} alt={video.title} className="thumbnail" />
        <span className="duration">{video.duration}</span>
        {video.isLive && <span className="live-badge">LIVE</span>}
      </Link>
      <div className="video-info">
        <Link to={`/channel/${video.channelId}`} className="channel-img-container">
          <img 
            src={video.channelImg || 'https://via.placeholder.com/40'} 
            alt={video.author || 'Channel'} 
            className="channel-img"
          />
        </Link>
        <div className="video-details">
          <Link to={`/video/${video.id || video._id}`} className="video-title">
            {video.title}
          </Link>
          <Link to={`/channel/${video.channelId}`} className="channel-name">
            {video.author}
          </Link>
          <div className="video-meta">
            <span>{video.views} views</span>
            <span className="dot">•</span>
            <span>{video.uploadTime || formatDistanceToNow(new Date(video.createdAt || video.uploadDate), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;