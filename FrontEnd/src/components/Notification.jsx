import React, { useState, useEffect } from 'react';
import '../styles/Notification.css';

const Notification = ({ message, type = 'success', duration = 3000 }) => {
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setHiding(true);
    }, duration - 300); // Start hiding animation 300ms before removal
    
    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, duration);
    
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [duration]);

  if (!visible) return null;

  return (
    <div className={`notification ${type} ${hiding ? 'hide' : ''}`}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;