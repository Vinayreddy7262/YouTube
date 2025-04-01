import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { 
    FaBars, 
    FaSearch, 
    FaYoutube, 
    FaBell, 
    FaUser, 
    FaVideo, 
    FaHome, 
    FaFire, 
    FaHistory, 
    FaBook 
  } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
      setShowMobileSearch(false);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <Link to="/" className="logo">
          <FaYoutube className="youtube-icon" />
          <span>YouTube</span>
        </Link>
      </div>

      {/* Regular search form */}
      <form className={`search-form ${showMobileSearch ? 'mobile-active' : ''}`} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-btn">
          <FaSearch />
        </button>
      </form>

      {/* Mobile search button */}
      <button className="mobile-search-btn" onClick={toggleMobileSearch}>
        <FaSearch />
      </button>

      <div className="header-right">
        {currentUser ? (
          <>
            <Link to="/upload" className="upload-btn">
              <FaVideo />
            </Link>
            <FaBell className="notification-icon" />
            <div className="user-menu">
              <img 
                src={currentUser.avatar || "https://via.placeholder.com/32"} // Fallback image
                alt={currentUser.username} 
                className="avatar"
              />
              <div className="dropdown-menu">
                <Link to="/channel/user">My Channel</Link>
                <button onClick={logout}>Sign Out</button>
              </div>
            </div>
          </>
        ) : (
          <Link to="/login" className="signin-btn">
            <FaUser />
            <span>Sign In</span>
          </Link>
        )}
      </div>

      {showSidebar && (
        <div className="sidebar">
          <div className="sidebar-section">
            <Link to="/" className="sidebar-item" onClick={() => setShowSidebar(false)}>
              <FaHome />
              <span>Home</span>
            </Link>
            <Link to="/?category=Trending" className="sidebar-item" onClick={() => setShowSidebar(false)}>
              <FaFire />
              <span>Trending</span>
            </Link>
            <Link to="/?category=Subscriptions" className="sidebar-item" onClick={() => setShowSidebar(false)}>
              <FaYoutube />
              <span>Subscriptions</span>
            </Link>
          </div>
          <div className="sidebar-section">
            <Link to="/library" className="sidebar-item" onClick={() => setShowSidebar(false)}>
              <FaBook />
              <span>Library</span>
            </Link>
            <Link to="/history" className="sidebar-item" onClick={() => setShowSidebar(false)}>
              <FaHistory />
              <span>History</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;