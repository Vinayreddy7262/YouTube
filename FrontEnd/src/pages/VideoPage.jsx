// client/src/pages/VideoPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { formatDistanceToNow } from 'date-fns';
import { FaThumbsUp, FaThumbsDown, FaShare, FaDownload, FaSave } from 'react-icons/fa';
import CommentSection from '../components/CommentSection';
import VideoCard from '../components/VideoCard';
import AuthContext from '../context/AuthContext';
import '../styles/VideoPage.css';

const VideoPage = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    fetchVideo();
    fetchRelatedVideos();
  }, [id]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      
      // Try to get from sample data first
      try {
        const response = await fetch('/sample-data.json');
        const data = await response.json();
        const foundVideo = data.find(v => v.id === id);
        
        if (foundVideo) {
          setVideo(foundVideo);
          setLikes(foundVideo.likes || 0);
          setDislikes(foundVideo.dislikes || 0);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log('Using API fallback for video data');
      }
      
      // If sample data doesn't have the video, use API
      const { data } = await axios.get(`/api/videos/${id}`);
      setVideo(data);
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching video:', error);
      setLoading(false);
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      // Try to get from sample data first
      try {
        const response = await fetch('/sample-data.json');
        const data = await response.json();
        // Exclude current video and limit to 10
        const related = data.filter(v => v.id !== id).slice(0, 10);
        
        if (related.length > 0) {
          setRelatedVideos(related);
          return;
        }
      } catch (error) {
        console.log('Using API fallback for related videos');
      }
      
      // If sample data doesn't work, use API
      const { data } = await axios.get(`/api/videos/${id}/related`);
      setRelatedVideos(data);
    } catch (error) {
      console.error('Error fetching related videos:', error);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      alert('Please sign in to like videos');
      return;
    }
    
    try {
      const { data } = await axios.put(`/api/videos/${id}/like`);
      setLikes(data.likes);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleDislike = async () => {
    if (!currentUser) {
      alert('Please sign in to dislike videos');
      return;
    }
    
    try {
      const { data } = await axios.put(`/api/videos/${id}/dislike`);
      setDislikes(data.dislikes);
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading video...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="video-not-found">
        <h2>Video not found</h2>
        <p>The video you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="back-btn">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="video-page">
      <div className="video-container">
        <div className="player-container">
          <ReactPlayer
            url={video.videoUrl}
            controls
            width="100%"
            height="100%"
            playing
            pip
          />
        </div>
        
        <div className="video-details">
          <h1 className="video-title">{video.title}</h1>
          
          <div className="video-meta">
            <div className="views-date">
              <span>{video.views} views</span>
              <span className="dot">•</span>
              <span>{video.uploadTime || formatDistanceToNow(new Date(video.createdAt || video.uploadDate), { addSuffix: true })}</span>
            </div>
            
            <div className="video-actions">
              <button className="action-btn" onClick={handleLike}>
                <FaThumbsUp /> {likes}
              </button>
              <button className="action-btn" onClick={handleDislike}>
                <FaThumbsDown /> {dislikes}
              </button>
              <button className="action-btn">
                <FaShare /> Share
              </button>
              <button className="action-btn">
                <FaDownload /> Download
              </button>
              <button className="action-btn">
                <FaSave /> Save
              </button>
            </div>
          </div>
          
          <div className="channel-info">
            <Link to={`/channel/${video.channelId}`} className="channel-link">
              <img 
                src={video.channelImg || 'https://via.placeholder.com/48'} 
                alt={video.author} 
                className="channel-img"
              />
              <div className="channel-details">
                <h3 className="channel-name">{video.author}</h3>
                <p className="subscriber-count">{video.subscriber}</p>
              </div>
            </Link>
            <button className="subscribe-btn">Subscribe</button>
          </div>
          
          <div className="video-description">
            <p>{video.description}</p>
          </div>
          
          <CommentSection videoId={id} />
        </div>
      </div>
      
      <div className="related-videos">
        <h3 className="related-title">Related Videos</h3>
        <div className="related-list">
          {relatedVideos.map(video => (
            <VideoCard key={video.id || video._id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;