import re
import nltk
import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import json
import os
from typing import List, Dict, Any
import string

# Initialize sentiment analyzer - download all required resources
nltk.download('vader_lexicon')
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

class SentimentAnalyzer:
    def __init__(self):
        self.sia = SentimentIntensityAnalyzer()
        # Customize the VADER lexicon for academic context
        self.customize_vader_lexicon()
        
        # Regular expression to find course codes like BU111, CP104, MA103, etc.
        self.course_pattern = re.compile(r'\b[A-Z]{2,4}[0-9]{3,4}\b')
        
        # Bird course specific terms and their sentiment values
        self.bird_terms = {
            'bird': 2.0,
            'easy': 2.0,
            'straightforward': 1.5,
            'simple': 1.5,
            'effortless': 2.0,
            'basic': 1.0,
            'accessible': 1.0,
            'manageable': 1.0,
            'introductory': 0.5,
            'elementary': 1.0,
            'lightweight': 1.5,
            'minimal work': 2.0,
            'minimal effort': 2.0,
            'gpa booster': 2.5,
            'grade booster': 2.5,
            'boost your gpa': 2.5,
            'boost your grade': 2.5,
            'no midterm': 1.5,
            'no final': 1.5,
            'no exam': 1.5,
            'online': 0.5,
            'little work': 1.5,
            'recommended': 1.0,
            'enjoyed': 1.0,
        }
        
        # Anti-bird course terms
        self.anti_bird_terms = {
            'difficult': -1.5,
            'hard': -1.5,
            'tough': -1.5,
            'challenging': -1.0,
            'time-consuming': -1.5,
            'heavy workload': -2.0,
            'avoid': -2.0,
            'stay away': -2.0,
            'not worth': -1.5,
            'stressful': -1.5,
            'confusing': -1.0,
            'complicated': -1.0,
            'demanding': -1.0,
            'lot of work': -1.5,
            'lots of work': -1.5,
            'difficult professor': -1.5,
            'hard grader': -1.5,
            'fails': -2.0,
            'failed': -2.0,
            'failing': -2.0,
            'not recommended': -1.5,
            'midterm': -0.5,
            'final': -0.5,
            'exam': -0.5,
            'mandatory': -1.0,
            'required': -1.0,
            'prerequisite': -0.5,
        }
        
        # Department/subject-specific adjustments
        # Negative values indicate typically harder courses that shouldn't be ranked as birds
        self.department_adjustments = {
            'CP': -2.0,  # Computer Science courses
            'MA': -2.0,  # Math courses
            'PC': -1.5,  # Physics courses
            'CH': -1.5,  # Chemistry courses
            'BU': -1.0,  # Business courses (core ones tend to be harder)
            'EC': -0.5,  # Economics courses
            
            # Typically considered easier/more bird-like
            'ES': 1.0,   # Environmental Studies
            'UU': 1.0,   # University courses (often lighter)
            'AN': 0.5,   # Anthropology
            'AS': 0.5,   # Astronomy
            'SC': 0.5,   # Science (general) 
            'AR': 0.5,   # Archaeology
            'EM': 1.0,   # Educational studies
        }
        
        # Load stopwords
        self.stopwords = set(nltk.corpus.stopwords.words('english'))
        
    def customize_vader_lexicon(self):
        """Add domain-specific terms to VADER lexicon"""
        # Academic terms with positive sentiment for bird courses
        academic_lexicon = {
            'easy': 2.0,
            'straightforward': 1.5,
            'manageable': 1.0,
            'bird': 3.0,  # The term "bird course" is very positive in this context
            'simple': 1.5,
            'interesting': 1.0,
            'engaging': 1.0,
            'recommended': 1.5,
            'fun': 1.5,
            'enjoyable': 1.5,
            'light': 1.0,
            'minimal': 1.0,
            'online': 0.5,
            'attendance': -0.5,  # Required attendance might be negative for bird courses
            'participation': -0.5,
            'exam': -0.5,
            'midterm': -0.5,
            'final': -0.5,
            'essay': -0.5,
            'paper': -0.5,
            'project': -0.5,
            'presentation': -0.5,
            'gpa': 1.0,
            'boost': 1.5,
            'booster': 2.0,

            # Add negative words for certain course types
            'calculus': -1.5,
            'programming': -1.0,
            'coding': -1.0,
            'physics': -1.5,
            'statistics': -1.0,
            'algorithms': -1.5,
            'computation': -1.0,
            'analysis': -0.5,
            'assignment': -0.5,
            'labs': -0.5,
            'lab': -0.5,
            'lecture': -0.3,
            'material': -0.3,
            'readings': -0.5,
            'textbook': -0.5,
            'assessment': -0.3,
            'quiz': -0.3,
            'test': -0.5,
        }
        
        # Update the VADER lexicon
        for word, score in academic_lexicon.items():
            self.sia.lexicon[word] = score
            
    def preprocess_text(self, text: str) -> str:
        """Preprocess text for better sentiment analysis"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+', '', text)
        
        # Remove punctuation (except for course codes)
        # Store course codes first
        course_codes = self.course_pattern.findall(text)
        # Remove punctuation
        text = text.translate(str.maketrans('', '', string.punctuation))
        # Re-add course codes
        for code in course_codes:
            if code.lower() not in text:
                text += f" {code}"
                
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
        
    def analyze_thread(self, thread: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze sentiment of a Reddit thread and extract course mentions"""
        # Combine title and selftext for analysis
        full_text = f"{thread['title']} {thread['selftext']}"
        
        # Preprocess text
        preprocessed_text = self.preprocess_text(full_text)
        
        # Get sentiment scores for the entire text
        sentiment = self.sia.polarity_scores(preprocessed_text)
        
        # Extract course mentions from original text (to preserve case)
        courses_mentioned = self.extract_courses(full_text)
        
        # Assign sentiment to each course
        course_sentiments = {}
        for course in courses_mentioned:
            # Find sentences containing the course
            sentences = self._find_sentences_with_course(full_text, course)
            
            # Calculate sentiment for each sentence mentioning the course
            course_sentiment = {"compound": 0, "pos": 0, "neu": 0, "neg": 0, "mentions": len(sentences), "bird_terms": {}}
            
            if sentences:
                for sentence in sentences:
                    # Preprocess sentence
                    processed_sentence = self.preprocess_text(sentence)
                    
                    # Get VADER sentiment
                    sent = self.sia.polarity_scores(processed_sentence)
                    
                    # Look for bird course keywords
                    bird_term_score = self.detect_bird_terms(processed_sentence)
                    
                    # Apply additional weight to the compound score based on bird terms
                    sent["compound"] = min(1.0, max(-1.0, sent["compound"] + (bird_term_score * 0.3)))
                    
                    # Update compound and other scores
                    course_sentiment["compound"] += sent["compound"]
                    course_sentiment["pos"] += sent["pos"]
                    course_sentiment["neu"] += sent["neu"]
                    course_sentiment["neg"] += sent["neg"]
                    
                    # Store bird terms found
                    for term, count in self.detect_bird_terms_dict(processed_sentence).items():
                        if term in course_sentiment["bird_terms"]:
                            course_sentiment["bird_terms"][term] += count
                        else:
                            course_sentiment["bird_terms"][term] = count
                
                # Average the sentiment scores
                if len(sentences) > 0:
                    course_sentiment["compound"] /= len(sentences)
                    course_sentiment["pos"] /= len(sentences)
                    course_sentiment["neu"] /= len(sentences)
                    course_sentiment["neg"] /= len(sentences)
                    
                # Add context boost if the thread title directly mentions the course
                if course in thread['title']:
                    course_sentiment["compound"] = min(1.0, course_sentiment["compound"] * 1.2)
                    course_sentiment["title_mention"] = True
                else:
                    course_sentiment["title_mention"] = False
                
                # Apply department-specific adjustment
                dept_code = course[:2]  # Extract department code (e.g., 'CP' from 'CP104')
                if dept_code in self.department_adjustments:
                    # Apply department adjustment as a multiplier if sentiment is positive,
                    # or directly add it if sentiment is negative or the adjustment is positive
                    adjustment = self.department_adjustments[dept_code]
                    if adjustment < 0 and course_sentiment["compound"] > 0:
                        # For negative adjustments (harder courses) and positive sentiment, 
                        # reduce the positive sentiment
                        course_sentiment["compound"] += adjustment
                    elif adjustment > 0:
                        # For positive adjustments (easier courses), boost regardless of sentiment
                        course_sentiment["compound"] += adjustment
            
            # Apply thread score influence (popular threads carry more weight)
            # But scale it down for more balanced results
            thread_score_factor = min(1.2, max(1.0, 1 + (thread['score'] / 150)))
            if course_sentiment["compound"] > 0:
                course_sentiment["compound"] *= thread_score_factor
            
            # Store department code for later use
            course_sentiment["department"] = course[:2]
            
            course_sentiments[course] = course_sentiment
            
        # Add sentiment and course information to thread
        thread_with_sentiment = thread.copy()
        thread_with_sentiment["sentiment"] = sentiment
        thread_with_sentiment["courses"] = course_sentiments
        
        return thread_with_sentiment
    
    def detect_bird_terms(self, text: str) -> float:
        """Detect bird course specific terms and calculate a score"""
        text = text.lower()
        score = 0.0
        
        # Check for bird course terms
        for term, value in self.bird_terms.items():
            if term in text:
                score += value * text.count(term)
                
        # Check for anti-bird course terms
        for term, value in self.anti_bird_terms.items():
            if term in text:
                score += value * text.count(term)
                
        return score
    
    def detect_bird_terms_dict(self, text: str) -> Dict[str, int]:
        """Return a dictionary of bird terms found and their counts"""
        text = text.lower()
        found_terms = {}
        
        # Check for bird course terms
        for term in self.bird_terms:
            if term in text:
                found_terms[term] = text.count(term)
                
        # Check for anti-bird course terms
        for term in self.anti_bird_terms:
            if term in text:
                found_terms[f"anti:{term}"] = text.count(term)
                
        return found_terms
    
    def extract_courses(self, text: str) -> List[str]:
        """Extract course codes from text"""
        return list(set(self.course_pattern.findall(text)))
    
    def _find_sentences_with_course(self, text: str, course: str) -> List[str]:
        """Find sentences that mention a specific course using NLTK"""
        try:
            sentences = nltk.sent_tokenize(text)
            
            # Get sentences containing the course
            course_sentences = [sent for sent in sentences if course in sent]
            
            # Also include context sentences (sentences before and after)
            context_sentences = []
            for i, sent in enumerate(sentences):
                if course in sent:
                    # Add previous sentence for context
                    if i > 0:
                        context_sentences.append(sentences[i-1])
                    # Add next sentence for context
                    if i < len(sentences) - 1:
                        context_sentences.append(sentences[i+1])
            
            # Combine and return unique sentences
            all_sentences = course_sentences + context_sentences
            return list(set(all_sentences))
        except LookupError:
            # Fall back to simple method if NLTK fails
            return self._find_sentences_with_course_simple(text, course)
            
    def _find_sentences_with_course_simple(self, text: str, course: str) -> List[str]:
        """Find sentences that mention a specific course using a simple split approach"""
        # Split by common sentence terminators
        rough_sentences = re.split(r'[.!?]+', text)
        direct_mentions = [sent.strip() for sent in rough_sentences if course in sent]
        
        # Find indices of sentences with direct mentions
        indices = []
        for i, sent in enumerate(rough_sentences):
            if course in sent:
                indices.append(i)
                
        # Include context sentences
        context_sentences = []
        for idx in indices:
            if idx > 0:
                context_sentences.append(rough_sentences[idx-1].strip())
            if idx < len(rough_sentences) - 1:
                context_sentences.append(rough_sentences[idx+1].strip())
                
        # Combine direct mentions and context sentences
        all_sentences = direct_mentions + context_sentences
        return [s for s in all_sentences if s]  # Remove empty strings
                
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
                        "department": course[:2],
                        "mentions": 0,
                        "score": 0,
                        "compound": 0,
                        "pos": 0,
                        "neu": 0,
                        "neg": 0,
                        "bird_score": 0,
                        "bird_terms": {},
                        "threads": []
                    }
                
                # Update course data
                course_data[course]["mentions"] += sentiment["mentions"]
                course_data[course]["compound"] += sentiment["compound"] * sentiment["mentions"]
                course_data[course]["pos"] += sentiment["pos"] * sentiment["mentions"]
                course_data[course]["neu"] += sentiment["neu"] * sentiment["mentions"]
                course_data[course]["neg"] += sentiment["neg"] * sentiment["mentions"]
                course_data[course]["score"] += thread["score"]
                
                # Update bird terms
                for term, count in sentiment.get("bird_terms", {}).items():
                    if term in course_data[course]["bird_terms"]:
                        course_data[course]["bird_terms"][term] += count
                    else:
                        course_data[course]["bird_terms"][term] = count
                
                # Add thread to course's thread list
                thread_info = {
                    "id": thread["id"],
                    "title": thread["title"],
                    "url": thread["url"],
                    "score": thread["score"],
                    "sentiment": sentiment["compound"]
                }
                
                # Add title_mention flag if it exists
                if "title_mention" in sentiment:
                    thread_info["title_mention"] = sentiment["title_mention"]
                    
                course_data[course]["threads"].append(thread_info)
                
        # Calculate averages and bird score
        for course in course_data.values():
            if course["mentions"] > 0:
                course["compound"] /= course["mentions"]
                course["pos"] /= course["mentions"]
                course["neu"] /= course["mentions"]
                # Fix the division by zero error - divide by mentions, not by neg itself
                course["neg"] /= course["mentions"]
                
            # Calculate bird term score
            bird_term_score = 0
            for term, count in course["bird_terms"].items():
                if term.startswith("anti:"):
                    # This is an anti-bird term
                    actual_term = term[5:]  # Remove "anti:" prefix
                    bird_term_score += self.anti_bird_terms.get(actual_term, 0) * count
                else:
                    bird_term_score += self.bird_terms.get(term, 0) * count
                    
            # Normalize bird term score based on mentions
            if course["mentions"] > 0:
                bird_term_score /= course["mentions"]
                
            # Calculate title mention bonus
            title_mentions = sum(1 for thread in course["threads"] if thread.get("title_mention", False))
            title_bonus = title_mentions * 0.3  # Reduced from 0.5
                
            # Get department adjustment
            dept_code = course["department"]
            dept_adjustment = self.department_adjustments.get(dept_code, 0)
            
            # Examine comment counts in threads - courses with more comments tend to be discussed more
            # and could indicate controversial/difficult courses
            total_comments = sum(thread.get("num_comments", 0) for thread in course["threads"])
            avg_comments = total_comments / len(course["threads"]) if course["threads"] else 0
            comment_factor = min(0.5, max(-0.5, (avg_comments - 10) / -20))  # Negative for high comment counts
            
            # Context clues from course code (higher numbers often indicate more specialized courses)
            course_number = 0
            try:
                # Extract the numeric part of the course code
                numeric_part = re.search(r'\d+', course["code"])
                if numeric_part:
                    course_number = int(numeric_part.group())
            except (ValueError, AttributeError):
                pass
                
            # Higher course numbers generally indicate more advanced, potentially harder courses
            level_adjustment = 0
            if course_number >= 300:
                level_adjustment = -0.5  # Harder senior-level courses
            elif course_number >= 200:
                level_adjustment = -0.3  # Moderately harder intermediate courses
            elif course_number >= 100:
                level_adjustment = 0     # No adjustment for first-year courses
                
            # Calculate bird score with all factors
            # Higher scores indicate "bird courses"
            course["bird_score"] = (
                (course["compound"] * 2.5) +     # Weight sentiment 
                (min(1.5, course["mentions"] / 5)) +  # More mentions = more likely to be notable, but cap at 1.5
                (course["pos"] * 2) -           # Positive sentiment is good for bird courses
                (course["neg"] * 3) +           # Negative sentiment reduces bird score with higher weight
                (bird_term_score * 1.5) +       # Bird terms are strong indicators
                (min(0.8, course["score"] / 50)) +  # Reddit score provides social validation, cap at 0.8
                title_bonus +                   # Bonus for title mentions
                dept_adjustment +               # Department-specific adjustment
                comment_factor +                # Comment factor (negative for high comment counts)
                level_adjustment                # Course level adjustment
            )
            
            # Store additional scores for reference
            course["bird_term_score"] = bird_term_score
            course["dept_adjustment"] = dept_adjustment
            course["comment_factor"] = comment_factor
            course["level_adjustment"] = level_adjustment
        
        # Convert to list and sort by bird score
        course_list = list(course_data.values())
        course_list.sort(key=lambda x: x["bird_score"], reverse=True)
        
        return course_list