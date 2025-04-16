require('dotenv').config({ path: '../../.env' });
const express = require('express');
const redditService = require('./redditService');

const app = express();
const PORT = process.env.REDDIT_API_PORT || 3001;

// Middleware
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Bird Course API endpoint
app.get('/api/bird-courses', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 25;
    const timePeriod = req.query.timePeriod || 'year';
    
    const threads = await redditService.getBirdCourseThreads(limit, timePeriod);
    res.json(threads);
  } catch (error) {
    console.error('Error fetching bird course threads:', error);
    res.status(500).json({ error: error.message });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('BirdWatch Reddit API is running. Use /api/bird-courses to get popular bird course threads from r/wlu');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Reddit API service running on port ${PORT}`);
  console.log(`Access the bird courses endpoint at: http://localhost:${PORT}/api/bird-courses`);
});

module.exports = app;