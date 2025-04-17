const express = require('express');
const cors = require('cors');
const redditService = require('./redditService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/bird-courses', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const timePeriod = req.query.timePeriod || 'year';
    
    const threads = await redditService.getBirdCourseThreads(limit, timePeriod);
    res.json(threads);
  } catch (error) {
    console.error('Error fetching bird courses:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/top-bird-courses', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 10;
    const courses = await redditService.getTopBirdCourses(count);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching top bird courses:', error);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint for course-specific threads
app.get('/api/course-threads/:courseCode', async (req, res) => {
  try {
    const courseCode = req.params.courseCode.toUpperCase();
    const limit = parseInt(req.query.limit) || 25;
    
    if (!courseCode || !/^[A-Z]{2,4}[0-9]{3,4}$/.test(courseCode)) {
      return res.status(400).json({ error: 'Invalid course code format. Expected format: XX123 or XXX123' });
    }
    
    const threads = await redditService.getCourseSpecificThreads(courseCode, limit);
    res.json(threads);
  } catch (error) {
    console.error(`Error fetching threads for course ${req.params.courseCode}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start server
app.listen(PORT, () => {
  console.log(`Reddit API Service running on port ${PORT}`);
});