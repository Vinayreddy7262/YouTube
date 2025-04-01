const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // Add this line to import path module

// Load environment variables
dotenv.config();

const app = express();

// Middleware
// CORS must be configured BEFORE defining routes
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const channelRoutes = require('./routes/channels');
const commentRoutes = require('./routes/comments');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/comments', commentRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));