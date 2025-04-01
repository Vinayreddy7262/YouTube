// client/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import VideoGrid from '../components/VideoGrid';
import CategoryFilter from '../components/CategoryFilter';
import '../styles/HomePage.css';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  useEffect(() => {
    fetchVideos();
  }, [location.search]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      // Initially, try to load from predefined data (from your paste.txt)
      // In a real app, you would just make the API call and not handle sample data like this
      let data = [];
      
      if (!categoryParam && !searchParam) {
        // Load sample data directly for initial load
        try {
          const sampleResponse = await fetch('/sample-data.json');
          data = await sampleResponse.json();
        } catch (error) {
          console.log('Using API fallback');
          // If sample data fails, use API
          const response = await axios.get('/api/videos');
          data = response.data;
        }
      } else {
        // For category and search, use API
        let url = '/api/videos?';
        if (categoryParam) url += `category=${categoryParam}`;
        if (searchParam) url += `${categoryParam ? '&' : ''}search=${searchParam}`;
        
        const response = await axios.get(url);
        data = response.data;
      }
      
      setVideos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <CategoryFilter />
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading videos...</p>
        </div>
      ) : (
        <>
          {searchParam && (
            <h2 className="search-results">
              Search results for: "{searchParam}"
            </h2>
          )}
          
          {videos.length === 0 ? (
            <div className="no-videos">
              <p>No videos found. Try a different search or category.</p>
            </div>
          ) : (
            <VideoGrid videos={videos} />
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;