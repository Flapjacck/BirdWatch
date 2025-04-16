const axios = require('axios');
require('dotenv').config({ path: '../../.env' });

class RedditService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.userAgent = 'BirdWatch/1.0.0 (by /u/your_username)';
  }

  async getAccessToken() {
    // Check if token is still valid
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    try {
      // For Reddit's API, we can use an "app only" OAuth flow
      // This doesn't require a username/password, just client credentials
      // Or we can use the public API without authentication for read-only operations
      const response = await axios({
        method: 'get',
        url: 'https://www.reddit.com/r/wlu/search.json',
        params: {
          q: 'bird course',
          restrict_sr: 'on',
          t: 'year',
          limit: 100,
          sort: 'relevance'
        },
        headers: {
          'User-Agent': this.userAgent
        }
      });

      return 'public-access'; // Not using actual OAuth for simplicity
    } catch (error) {
      console.error('Error connecting to Reddit:', error.message);
      throw new Error('Failed to connect to Reddit API');
    }
  }

  async getBirdCourseThreads(limit = 100, timePeriod = 'year') {
    try {
      // Using public API - no need for authentication for this use case
      const response = await axios({
        method: 'get',
        url: 'https://www.reddit.com/r/wlu/search.json',
        params: {
          q: 'bird course',
          restrict_sr: 'on',
          t: timePeriod,
          limit: limit,
          sort: 'relevance'
        },
        headers: {
          'User-Agent': this.userAgent
        }
      });

      if (!response.data || !response.data.data || !response.data.data.children) {
        return [];
      }

      return response.data.data.children.map(post => {
        const data = post.data;
        return {
          id: data.id,
          title: data.title,
          author: data.author,
          created: new Date(data.created_utc * 1000).toISOString(),
          url: `https://www.reddit.com${data.permalink}`,
          selftext: data.selftext,
          score: data.score,
          num_comments: data.num_comments,
          upvote_ratio: data.upvote_ratio
        };
      });
    } catch (error) {
      console.error('Error fetching bird course threads:', error.message);
      throw new Error('Failed to fetch data from Reddit');
    }
  }

  async getTopBirdCourses(count = 10) {
    // This would be based on processed data from sentiment analysis
    // For now, just return placeholder data to show the API structure
    return [
      { code: 'EM203', bird_score: 8.7, mentions: 42 },
      { code: 'EM202', bird_score: 7.9, mentions: 38 },
      { code: 'UU150', bird_score: 7.5, mentions: 29 },
      { code: 'ES110', bird_score: 7.2, mentions: 31 },
      { code: 'CP102', bird_score: 6.8, mentions: 25 }
    ];
  }
}

module.exports = new RedditService();