// client/src/components/CommentSection.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import '../styles/CommentSection.css';

const CommentSection = ({ videoId }) => {
  const { currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/comments/${videoId}`);
      setComments(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    if (!currentUser) {
      alert('Please sign in to comment');
      return;
    }
    
    try {
      const { data } = await axios.post('/api/comments', {
        videoId,
        text: commentText
      });
      
      setComments([data, ...comments]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const submitEdit = async () => {
    if (!editText.trim()) return;
    
    try {
      const { data } = await axios.put(`/api/comments/${editingId}`, {
        text: editText
      });
      
      setComments(comments.map(comment => 
        comment._id === editingId ? data : comment
      ));
      
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/comments/${id}`);
      setComments(comments.filter(comment => comment._id !== id));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading comments...</div>;
  }

  return (
    <div className="comment-section">
      <h3>{comments.length} Comments</h3>
      
      {currentUser && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <img 
            src={currentUser.avatar} 
            alt={currentUser.username} 
            className="user-avatar"
          />
          <div className="comment-input-container">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="comment-input"
            />
            <div className="comment-actions">
              <button type="button" onClick={() => setCommentText('')}>
                Cancel
              </button>
              <button type="submit" disabled={!commentText.trim()}>
                Comment
              </button>
            </div>
          </div>
        </form>
      )}
      
      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment._id} className="comment">
            <img 
              src={comment.userId.avatar} 
              alt={comment.userId.username} 
              className="user-avatar"
            />
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-author">{comment.userId.username}</span>
                <span className="comment-date">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              {editingId === comment._id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-input"
                  />
                  <div className="edit-actions">
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                    <button onClick={submitEdit}>Save</button>
                  </div>
                </div>
              ) : (
                <p className="comment-text">{comment.text}</p>
              )}
              
              {currentUser && currentUser._id === comment.userId._id && (
                <div className="comment-actions">
                  <button onClick={() => handleEdit(comment)}>Edit</button>
                  <button onClick={() => handleDelete(comment._id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;