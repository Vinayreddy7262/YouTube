// client/src/components/CategoryFilter.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/CategoryFilter.css';

const CategoryFilter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category') || 'All';

  const categories = [
    'All',
    'Music',
    'Gaming',
    'Sports',
    'News',
    'Education',
    'Comedy',
    'Entertainment',
    'Technology',
    'Travel'
  ];

  const handleCategoryClick = (category) => {
    if (category === 'All') {
      navigate('/');
    } else {
      navigate(`/?category=${category}`);
    }
  };

  return (
    <div className="category-filter">
      {categories.map(category => (
        <button
          key={category}
          className={`category-btn ${category === currentCategory ? 'active' : ''}`}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;