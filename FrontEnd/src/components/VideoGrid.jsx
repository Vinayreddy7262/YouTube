// client/src/components/VideoGrid.js
import React from 'react';
import VideoCard from './VideoCard';
import '../styles/VideoGrid.css';

const VideoGrid = ({ videos, title }) => {
  return (
    <div className="video-grid-container">
      {title && <h2 className="section-title">{title}</h2>}
      <div className="video-grid">
        {videos.map(video => (
          <VideoCard key={video.id || video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;