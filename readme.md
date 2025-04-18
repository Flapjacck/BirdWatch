# BirdWatch 🦅

BirdWatch is a website that helps students find and analyze "bird courses" (easy courses) by analyzing Reddit discussions using sentiment analysis and natural language processing.

## Project Structure

```
BirdWatch/
├── frontend/           # React + TypeScript frontend
├── backend/
│   ├── data/          # Python data processing scripts
│   └── reddit_api/    # Node.js Reddit API service
```

## Setup Instructions

### 1. Reddit API Service

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

### 2. Data Processing Pipeline

```bash
# Navigate to the data directory
cd backend/data

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Install requirements
pip install -r requirements.txt

# Run the pipeline
python pipeline.py
```

#### Pipeline Parameters

| Parameter | Description | Default | Options |
|-----------|-------------|---------|---------|
| --time-period | Time period to search | year | hour, day, week, month, year, all |
| --limit | Max threads to fetch | 200 | Any positive integer |
| --analyze-top-courses | Analyze top courses | True | Flag |
| --top-courses-count | Number of top courses | 15 | Any positive integer |

### 3. Frontend Application

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Course Analysis

You can analyze specific courses using:

```bash
cd backend/data
python course_details_analyzer.py --course-codes CS101 BU111 PS262 --limit 50
```

### Analysis Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| --course-codes | Courses to analyze | Required |
| --limit | Max threads per course | 25 |
| --output-dir | Output directory | processed/course_details |

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Vite

- Backend:
  - Node.js
  - Express
  - Python
  - NLTK (Natural Language Processing)
  - VADER Sentiment Analysis

## Author

Created by [Spencer Kelly](https://github.com/Flapjacck)
