const redditService = require('./redditService');

async function fetchBirdCourses() {
  try {
    // You can change these parameters as needed
    const limit = 10;
    const timePeriod = 'year'; // Options: 'hour', 'day', 'week', 'month', 'year', 'all'
    
    console.log(`Searching for bird courses from the past ${timePeriod}...`);
    const threads = await redditService.getBirdCourseThreads(limit, timePeriod);
    
    console.log(`\nFound ${threads.length} threads about bird courses:\n`);
    
    threads.forEach((thread, index) => {
      console.log(`${index + 1}. ${thread.title}`);
      console.log(`   Score: ${thread.score} | Comments: ${thread.num_comments} | Upvote Ratio: ${thread.upvote_ratio}`);
      console.log(`   Posted by: ${thread.author} on ${new Date(thread.created).toLocaleString()}`);
      console.log(`   URL: ${thread.url}`);
      console.log();
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the function
fetchBirdCourses();