# Setup

## 1. Setting up the Reddit API Service

The Reddit API service is a Node.js application that fetches data from Reddit.

```bash
# Navigate to the Reddit API directory
cd backend/reddit_api

# Install dependencies
npm install

# Start the API server
npm start

# For development with auto-restart
npm run dev
```

## 2. Python Environment Setup

```bash
# change to backend directory
cd backend/data

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Run the pipleine
python pipeline.py
```

### Pipeline Parameters

The pipeline can be customized with the following command-line arguments:

```bash
# Example with all parameters
python pipeline.py --time-period week --limit 300 --analyze-top-courses --top-courses-count 20
```

| Parameter | Description | Default | Options |
|-----------|-------------|---------|---------|
| --api-url | URL of the Reddit API service | http://localhost:3001 | Any valid URL |
| --limit | Maximum number of threads to fetch | 200 | Any positive integer |
| --time-period | Time period to search for posts | all | hour, day, week, month, year, all |
| --data-dir | Directory to save raw data | data | Any valid directory path |
| --processed-dir | Directory to save processed data | processed | Any valid directory path |
| --analyze-top-courses | Enable detailed analysis of top courses | True | Flag (no value needed) |
| --top-courses-count | Number of top courses to analyze | 15 | Any positive integer |
| --no-prompt | Run without prompting for time period | False | Flag (no value needed) |

The time period parameter determines how far back in time the Reddit API will search:

- `hour`: Posts from the last hour
- `day`: Posts from the last day
- `week`: Posts from the last week
- `month`: Posts from the last month
- `year`: Posts from the last year
- `all`: All posts regardless of time

### Course-Specific Analysis

You can analyze specific courses directly using the course_details_analyzer.py script:

```bash
# Example: Analyze specific courses
python course_details_analyzer.py --course-codes CS101 BU111 PS262 --limit 50
```

| Parameter | Description | Default | Options |
|-----------|-------------|---------|---------|
| --api-url | URL of the Reddit API service | http://localhost:3001 | Any valid URL |
| --course-codes | List of course codes to analyze (required) | None | Space-separated list of course codes |
| --limit | Maximum number of threads to fetch per course | 25 | Any positive integer |
| --output-dir | Directory to save course details | processed/course_details | Any valid directory path |

The script will:

1. Fetch Reddit threads specifically mentioning the given course codes
2. Analyze sentiment and extract key information about each course
3. Save detailed analysis as JSON files in the output directory
4. Generate a combined analysis file for all analyzed courses

## 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend server
npm run dev
```
