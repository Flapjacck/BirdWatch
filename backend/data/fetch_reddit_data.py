import os
import sys
import json
import requests
import argparse
from typing import List, Dict, Any
import datetime

def fetch_bird_course_threads(api_url: str, limit: int = 50, time_period: str = 'year') -> List[Dict[str, Any]]:
    """Fetch bird course threads from the Reddit API service"""
    try:
        url = f"{api_url}/api/bird-courses?limit={limit}&timePeriod={time_period}"
        print(f"Fetching data from: {url}")
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching bird course threads: {e}")
        return []

def save_to_json(data: Any, file_path: str) -> None:
    """Save data to a JSON file"""
    try:
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Data saved to {file_path}")
    except Exception as e:
        print(f"Error saving data to {file_path}: {e}")

def main():
    parser = argparse.ArgumentParser(description='Fetch bird course threads from Reddit API')
    parser.add_argument('--api-url', default='http://localhost:3001', help='URL of the Reddit API service')
    parser.add_argument('--limit', type=int, default=50, help='Maximum number of threads to fetch')
    parser.add_argument('--time-period', choices=['hour', 'day', 'week', 'month', 'year', 'all'], 
                        default='year', help='Time period to search')
    parser.add_argument('--output-dir', '-o', default='data', help='Directory to save fetched data')
    
    args = parser.parse_args()
    
    # Ensure output directory exists
    os.makedirs(args.output_dir, exist_ok=True)
    
    print(f"Fetching up to {args.limit} bird course threads from the past {args.time_period}...")
    threads = fetch_bird_course_threads(args.api_url, args.limit, args.time_period)
    
    if not threads:
        print("No threads fetched")
        return
    
    # Generate timestamp for filename
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save fetched data
    output_file = os.path.join(args.output_dir, f"bird_course_threads_{timestamp}.json")
    save_to_json(threads, output_file)
    
    # Also save as latest.json for easy access
    latest_file = os.path.join(args.output_dir, "latest_threads.json")
    save_to_json(threads, latest_file)
    
    print(f"Fetched and saved {len(threads)} threads")

if __name__ == "__main__":
    main()