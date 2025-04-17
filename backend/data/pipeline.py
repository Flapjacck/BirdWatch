import os
import sys
import argparse
import datetime
from fetch_reddit_data import fetch_bird_course_threads
from sentiment_analyzer import SentimentAnalyzer
import json

def save_to_json(data, file_path):
    """Save data to a JSON file"""
    try:
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Data saved to {file_path}")
    except Exception as e:
        print(f"Error saving data to {file_path}: {e}")

def load_json_file(file_path):
    """Load data from a JSON file"""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading data from {file_path}: {e}")
        return None

def run_pipeline(api_url, limit, time_period, data_dir, processed_dir):
    """Run the full data pipeline"""
    # Ensure directories exist
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(processed_dir, exist_ok=True)
    
    # Generate timestamp
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # 1. Fetch data from Reddit API
    print(f"Fetching up to {limit} bird course threads from the past {time_period}...")
    threads = fetch_bird_course_threads(api_url, limit, time_period)
    
    if not threads:
        print("No threads fetched. Make sure the Reddit API server is running.")
        print(f"Check that the API server is running at {api_url}")
        return
    
    # 2. Save raw data
    raw_data_file = os.path.join(data_dir, f"bird_course_threads_{timestamp}.json")
    save_to_json(threads, raw_data_file)
    latest_threads_file = os.path.join(data_dir, "latest_threads.json")
    save_to_json(threads, latest_threads_file)
    
    # 3. Initialize sentiment analyzer
    analyzer = SentimentAnalyzer()
    
    # 4. Analyze threads
    print(f"Analyzing {len(threads)} threads...")
    analyzed_threads = analyzer.analyze_threads(threads)
    
    # 5. Save analyzed threads
    analyzed_file = os.path.join(processed_dir, f"analyzed_threads_{timestamp}.json")
    save_to_json(analyzed_threads, analyzed_file)
    latest_analyzed_file = os.path.join(processed_dir, "latest_analyzed_threads.json")
    save_to_json(analyzed_threads, latest_analyzed_file)
    
    # 6. Generate course rankings
    print("Generating course rankings...")
    course_rankings = analyzer.get_course_rankings(analyzed_threads)
    
    # 7. Save course rankings
    rankings_file = os.path.join(processed_dir, f"course_rankings_{timestamp}.json")
    save_to_json(course_rankings, rankings_file)
    latest_rankings_file = os.path.join(processed_dir, "latest_course_rankings.json")
    save_to_json(course_rankings, latest_rankings_file)
    
    # 8. Print summary
    print(f"Pipeline completed successfully.")
    print(f"Processed {len(threads)} threads and identified {len(course_rankings)} courses")
    print(f"Top 5 bird courses:")
    for i, course in enumerate(course_rankings[:5], 1):
        print(f"{i}. {course['code']} - Bird Score: {course['bird_score']:.2f} - Mentions: {course['mentions']}")
        # Print department adjustment if available
        if 'dept_adjustment' in course:
            print(f"   Department adjustment: {course['dept_adjustment']:.2f}")

def main():
    parser = argparse.ArgumentParser(description='Run the BirdWatch data pipeline')
    parser.add_argument('--api-url', default='http://localhost:3001', help='URL of the Reddit API service')
    parser.add_argument('--limit', type=int, default=100, help='Maximum number of threads to fetch')
    parser.add_argument('--time-period', choices=['hour', 'day', 'week', 'month', 'year', 'all'], 
                        default='year', help='Time period to search')
    parser.add_argument('--data-dir', default='data', help='Directory to save raw data')
    parser.add_argument('--processed-dir', default='processed', help='Directory to save processed data')
    
    args = parser.parse_args()
    run_pipeline(args.api_url, args.limit, args.time_period, args.data_dir, args.processed_dir)

if __name__ == "__main__":
    main()