import re
import nltk
import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import json
import os
from typing import List, Dict, Any

# Initialize sentiment analyzer - download all required resources
nltk.download('vader_lexicon')
nltk.download('punkt')

class SentimentAnalyzer:
    def __init__(self):
        self.sia = SentimentIntensityAnalyzer()
        # Regular expression to find course codes like BU111, CP104, MA103, etc.
        self.course_pattern = re.compile(r'\b[A-Z]{2,4}[0-9]{3,4}\b')
        
    def analyze_thread(self, thread: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze sentiment of a Reddit thread and extract course mentions"""
        # Combine title and selftext for analysis
        full_text = f"{thread['title']} {thread['selftext']}"
        
        # Get sentiment scores
        sentiment = self.sia.polarity_scores(full_text)
        
        # Extract course mentions
        courses_mentioned = self.extract_courses(full_text)
        
        # Assign sentiment to each course
        course_sentiments = {}
        for course in courses_mentioned:
            # Find sentences containing the course
            # Use a simpler approach for finding sentences to avoid NLTK issues
            sentences = self._find_sentences_with_course_simple(full_text, course)
            
            # Calculate sentiment for each sentence mentioning the course
            course_sentiment = {"compound": 0, "pos": 0, "neu": 0, "neg": 0, "mentions": len(sentences)}
            
            if sentences:
                for sentence in sentences:
                    sent = self.sia.polarity_scores(sentence)
                    course_sentiment["compound"] += sent["compound"]
                    course_sentiment["pos"] += sent["pos"]
                    course_sentiment["neu"] += sent["neu"]
                    course_sentiment["neg"] += sent["neg"]
                
                # Average the sentiment scores
                if len(sentences) > 0:
                    course_sentiment["compound"] /= len(sentences)
                    course_sentiment["pos"] /= len(sentences)
                    course_sentiment["neu"] /= len(sentences)
                    course_sentiment["neg"] /= len(sentences)
            
            course_sentiments[course] = course_sentiment
            
        # Add sentiment and course information to thread
        thread_with_sentiment = thread.copy()
        thread_with_sentiment["sentiment"] = sentiment
        thread_with_sentiment["courses"] = course_sentiments
        
        return thread_with_sentiment
    
    def extract_courses(self, text: str) -> List[str]:
        """Extract course codes from text"""
        return list(set(self.course_pattern.findall(text)))
    
    def _find_sentences_with_course(self, text: str, course: str) -> List[str]:
        """Find sentences that mention a specific course using NLTK"""
        try:
            sentences = nltk.sent_tokenize(text)
            return [sent for sent in sentences if course in sent]
        except LookupError:
            # Fall back to simple method if NLTK fails
            return self._find_sentences_with_course_simple(text, course)
            
    def _find_sentences_with_course_simple(self, text: str, course: str) -> List[str]:
        """Find sentences that mention a specific course using a simple split approach"""
        # Split by common sentence terminators
        rough_sentences = re.split(r'[.!?]+', text)
        return [sent.strip() for sent in rough_sentences if course in sent]
                
    def analyze_threads(self, threads: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Analyze sentiment for a list of threads"""
        analyzed_threads = []
        
        for thread in threads:
            analyzed_thread = self.analyze_thread(thread)
            analyzed_threads.append(analyzed_thread)
            
        return analyzed_threads
    
    def get_course_rankings(self, threads: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate bird course rankings based on sentiment analysis"""
        # Analyze all threads if they haven't been analyzed yet
        analyzed_threads = threads
        if threads and "sentiment" not in threads[0]:
            analyzed_threads = self.analyze_threads(threads)
            
        # Aggregate course sentiments across all threads
        course_data = {}
        
        for thread in analyzed_threads:
            for course, sentiment in thread.get("courses", {}).items():
                if course not in course_data:
                    course_data[course] = {
                        "code": course,
                        "mentions": 0,
                        "score": 0,
                        "compound": 0,
                        "pos": 0,
                        "neu": 0,
                        "neg": 0,
                        "bird_score": 0,
                        "threads": []
                    }
                
                # Update course data
                course_data[course]["mentions"] += sentiment["mentions"]
                course_data[course]["compound"] += sentiment["compound"] * sentiment["mentions"]
                course_data[course]["pos"] += sentiment["pos"] * sentiment["mentions"]
                course_data[course]["neu"] += sentiment["neu"] * sentiment["mentions"]
                course_data[course]["neg"] += sentiment["neg"] * sentiment["mentions"]
                course_data[course]["score"] += thread["score"]
                
                # Add thread to course's thread list
                course_data[course]["threads"].append({
                    "id": thread["id"],
                    "title": thread["title"],
                    "url": thread["url"],
                    "score": thread["score"],
                    "sentiment": sentiment["compound"]
                })
                
        # Calculate averages and bird score
        for course in course_data.values():
            if course["mentions"] > 0:
                course["compound"] /= course["mentions"]
                course["pos"] /= course["mentions"]
                course["neu"] /= course["mentions"]
                course["neg"] /= course["mentions"]
                
            # Calculate bird score (weighted combination of positive sentiment, mentions, and overall score)
            # Higher scores indicate "bird courses"
            course["bird_score"] = (
                (course["compound"] * 2) +  # Weight sentiment highly
                (course["mentions"] / 5) +  # More mentions = more likely to be notable
                (course["pos"] * 3) -       # Positive sentiment is good for bird courses
                (course["neg"] * 2)         # Negative sentiment reduces bird score
            )
        
        # Convert to list and sort by bird score
        course_list = list(course_data.values())
        course_list.sort(key=lambda x: x["bird_score"], reverse=True)
        
        return course_list