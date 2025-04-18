const axios = require('axios');
require('dotenv').config({ path: '../../.env' });

class RedditService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.userAgent = 'BirdWatch/1.0.0 (by /u/your_username)';
    this.REQUEST_DELAY = 2000; // 2 seconds between requests
    this.MAX_RETRIES = 5; // Increased from 3
    this.BASE_DELAY = 2000; // Base delay for exponential backoff
    this.lastRequestTime = 0;
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async makeRateLimitedRequest(requestFn) {
    let retries = 0;
    while (retries < this.MAX_RETRIES) {
      // Ensure minimum delay between requests
      const timeSinceLastRequest = Date.now() - this.lastRequestTime;
      if (timeSinceLastRequest < this.REQUEST_DELAY) {
        await this.sleep(this.REQUEST_DELAY - timeSinceLastRequest);
      }

      try {
        this.lastRequestTime = Date.now();
        return await requestFn();
      } catch (error) {
        if (error.response?.status === 429 && retries < this.MAX_RETRIES - 1) {
          retries++;
          const waitTime = Math.pow(3, retries) * this.BASE_DELAY; // More aggressive exponential backoff
          console.log(`Rate limited, waiting ${waitTime/1000} seconds before retry ${retries}...`);
          await this.sleep(waitTime);
          continue;
        }
        throw error;
      }
    }
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
    return this.makeRateLimitedRequest(async () => {
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
    });
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

  async getCourseSpecificThreads(courseCode, limit = 25) {
    try {
      let allThreads = [];
      
      // First search for threads that mention the course in the title
      const titleThreads = await this.makeRateLimitedRequest(async () => {
        const response = await axios({
          method: 'get',
          url: 'https://www.reddit.com/r/wlu/search.json',
          params: {
            q: `title:${courseCode}`,  // Search specifically in titles
            restrict_sr: 'on',
            t: 'all',                  // Get all time results for more data
            limit: limit,
            sort: 'relevance'
          },
          headers: {
            'User-Agent': this.userAgent
          }
        });

        if (!response.data?.data?.children) return [];
        
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
            upvote_ratio: data.upvote_ratio,
            search_type: 'title_match'
          };
        });
      });
      
      allThreads = allThreads.concat(titleThreads);
      
      // Then search for threads that mention the course in the body
      const bodyThreads = await this.makeRateLimitedRequest(async () => {
        const response = await axios({
          method: 'get',
          url: 'https://www.reddit.com/r/wlu/search.json',
          params: {
            q: `selftext:${courseCode}`,  // Search in post content
            restrict_sr: 'on',
            t: 'all',
            limit: limit,
            sort: 'relevance'
          },
          headers: {
            'User-Agent': this.userAgent
          }
        });

        if (!response.data?.data?.children) return [];
        
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
            upvote_ratio: data.upvote_ratio,
            search_type: 'body_match'
          };
        });
      });
      
      allThreads = allThreads.concat(bodyThreads);
      
      // Finally, search for general mentions
      const generalThreads = await this.makeRateLimitedRequest(async () => {
        const response = await axios({
          method: 'get',
          url: 'https://www.reddit.com/r/wlu/search.json',
          params: {
            q: courseCode,  // General search
            restrict_sr: 'on',
            t: 'all',
            limit: limit,
            sort: 'relevance'
          },
          headers: {
            'User-Agent': this.userAgent
          }
        });

        if (!response.data?.data?.children) return [];
        
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
            upvote_ratio: data.upvote_ratio,
            search_type: 'general_match'
          };
        });
      });
      
      allThreads = allThreads.concat(generalThreads);
      
      // Remove duplicate threads (same ID)
      const uniqueThreads = Array.from(new Map(allThreads.map(thread => [thread.id, thread])).values());
      
      console.log(`Fetched ${uniqueThreads.length} unique threads about ${courseCode} (from ${allThreads.length} total matches)`);
      return uniqueThreads;
    } catch (error) {
      console.error(`Error fetching threads for course ${courseCode}:`, error.message);
      throw new Error(`Failed to fetch course-specific data for ${courseCode}`);
    }
  }
}

module.exports = new RedditService();