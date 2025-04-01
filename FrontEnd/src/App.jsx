// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import UploadVideo from './components/UploadVideo';
// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VideoPage from './pages/VideoPage';
import ChannelPage from './pages/ChannelPage';
import CreateChannelPage from './pages/CreateChannelPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/video/:id" element={<VideoPage />} />
          <Route path="/channel/:id" element={<ChannelPage />} />
          <Route path="/upload" element={<UploadVideo/>}/>
          <Route path="/create-channel" element={
            <ProtectedRoute>
              <CreateChannelPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;