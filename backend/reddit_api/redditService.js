const axios = require('axios');
require('dotenv').config({ path: '../../.env' });

class RedditService {
  constructor() {
    this.userAgent = `BirdWatch/1.0.0 (Node.js/${process.version}; Windows; by /u/${process.env.REDDIT_USERNAME})`;
  }

  /**
   * Fetches popular threads about bird courses from the WLU subreddit
   * @param {number} limit - Maximum number of threads to return
   * @param {string} timePeriod - Time period to search ('hour', 'day', 'week', 'month', 'year', 'all')
   * @returns {Promise<Array>} Array of thread objects
   */
  async getBirdCourseThreads(limit = 25, timePeriod = 'year') {
    try {
      console.log(`Fetching up to ${limit} bird course threads from past ${timePeriod}...`);
      
      // Validate time period
      const validTimePeriods = ['hour', 'day', 'week', 'month', 'year', 'all'];
      if (!validTimePeriods.includes(timePeriod)) {
        timePeriod = 'year'; // Default to year if invalid
      }
      
      // Use public API with search query
      const searchQuery = 'bird course';
      const url = `https://www.reddit.com/r/wlu/search.json?q=${encodeURIComponent(searchQuery)}&restrict_sr=on&limit=${limit}&sort=relevance&t=${timePeriod}`;
      
      const response = await axios({
        method: 'get',
        url: url,
        headers: {
          'User-Agent': this.userAgent
        }
      });
      
      if (!response.data.data.children.length) {
        console.log('No bird course threads found');
        return [];
      }
      
      console.log(`Found ${response.data.data.children.length} threads`);
      
      // Process and return the posts
      return response.data.data.children.map(child => {
        const post = child.data;
        return {
          id: post.id,
          title: post.title,
          author: post.author,
          created: new Date(post.created_utc * 1000).toISOString(),
          url: `https://www.reddit.com${post.permalink}`,
          selftext: post.selftext,
          score: post.score,
          num_comments: post.num_comments,
          upvote_ratio: post.upvote_ratio
        };
      }).sort((a, b) => b.score - a.score); // Sort by score (most popular first)
    } catch (error) {
      console.error('Error fetching bird course threads:', error.message);
      throw new Error('Failed to fetch bird course threads from Reddit');
    }
  }
}

module.exports = new RedditService();