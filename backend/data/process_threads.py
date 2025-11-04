import os
import sys
import json
import argparse
import datetime
from sentiment_analyzer import SentimentAnalyzer
from typing import List, Dict, Any

def load_threads_from_file(file_path: str) -> List[Dict[str, Any]]:
    """Load Reddit threads from a JSON file"""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading threads from {file_path}: {e}")
        return []

def save_to_json(data: Any, file_path: str) -> None:
    """Save data to a JSON file"""
    try:
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Data saved to {file_path}")
    except Exception as e:
        print(f"Error saving data to {file_path}: {e}")

def process_threads(input_file: str, output_dir: str = "processed") -> None:
    """Process Reddit threads with sentiment analysis"""
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Load threads
    threads = load_threads_from_file(input_file)
    if not threads:
        print("No threads to process")
        return
    
    print(f"Processing {len(threads)} threads...")
    
    # Initialize sentiment analyzer
    analyzer = SentimentAnalyzer()
    
    # Analyze threads
    analyzed_threads = analyzer.analyze_threads(threads)
    
    # Generate course rankings
    course_rankings = analyzer.get_course_rankings(analyzed_threads)
    
    # Generate timestamp for filenames
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save analyzed threads
    threads_output = os.path.join(output_dir, f"analyzed_threads_{timestamp}.json")
    save_to_json(analyzed_threads, threads_output)
    
    # Save course rankings
    rankings_output = os.path.join(output_dir, f"course_rankings_{timestamp}.json")
    save_to_json(course_rankings, rankings_output)
    
    # Save latest course rankings (overwrite previous)
    latest_rankings = os.path.join(output_dir, "latest_course_rankings.json")
    save_to_json(course_rankings, latest_rankings)
    
    print(f"Processed {len(threads)} threads and identified {len(course_rankings)} courses")
    print(f"Top 5 bird courses:")
    for i, course in enumerate(course_rankings[:5], 1):
        print(f"{i}. {course['code']} - Bird Score: {course['bird_score']:.2f} - Mentions: {course['mentions']}")

def main():
    parser = argparse.ArgumentParser(description='Process Reddit threads with sentiment analysis')
    parser.add_argument('input_file', help='Path to JSON file containing Reddit threads')
    parser.add_argument('--output-dir', '-o', default='processed', help='Directory to save processed data')
    
    args = parser.parse_args()
    process_threads(args.input_file, args.output_dir)

if __name__ == "__main__":
    main()