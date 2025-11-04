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
        self.customize_vader_lexicon()
        
        # Regular expression to find course codes
        self.course_pattern = re.compile(r'\b[A-Z]{2,4}[0-9]{3,4}\b')
        
        # Enhanced bird course terms with more nuanced scores
        self.bird_terms = {
            # Strong positive indicators
            'bird': 3.0,
            'gpa booster': 3.0,
            'grade booster': 3.0,
            'boost your gpa': 3.0,
            'easy a': 3.0,
            'guaranteed a': 3.0,
            
            # Clear positive indicators
            'easy': 2.5,
            'straightforward': 2.0,
            'simple': 2.0,
            'effortless': 2.5,
            'minimal work': 2.5,
            'minimal effort': 2.5,
            'little work': 2.0,
            
            # Moderate positive indicators
            'basic': 1.5,
            'accessible': 1.5,
            'manageable': 1.5,
            'not difficult': 1.5,
            'light workload': 2.0,
            'not bad': 1.0,
            'doable': 1.0,
            'fair': 1.0,
            
            # Course structure positives
            'no midterm': 2.0,
            'no final': 2.0,
            'no exam': 2.0,
            'online': 1.0,
            'open book': 1.5,
            'take home': 1.0,
            
            # Experience indicators
            'enjoyed': 1.5,
            'interesting': 1.0,
            'fun': 1.5,
            'recommend': 1.5,
            'worth taking': 1.5,
            'great prof': 1.5,
            'good prof': 1.0
        }
        
        # Enhanced anti-bird terms with more nuanced negative scoring
        self.anti_bird_terms = {
            # Strong negative indicators
            'extremely difficult': -3.0,
            'very difficult': -2.5,
            'really hard': -2.5,
            'super hard': -2.5,
            'avoid': -3.0,
            'stay away': -3.0,
            'nightmare': -3.0,
            'impossible': -3.0,
            
            # Clear negative indicators
            'difficult': -2.0,
            'hard': -2.0,
            'tough': -2.0,
            'challenging': -1.5,
            'heavy workload': -2.0,
            'time-consuming': -2.0,
            'intense': -2.0,
            
            # Moderate negative indicators
            'tricky': -1.5,
            'confusing': -1.5,
            'complicated': -1.5,
            'demanding': -1.5,
            'lot of work': -1.5,
            'lots of work': -1.5,
            
            # Course structure negatives
            'mandatory attendance': -1.0,
            'participation heavy': -1.0,
            'strict': -1.5,
            'harsh grading': -2.0,
            'tough grader': -2.0,
            
            # Performance indicators
            'failed': -2.5,
            'failing': -2.5,
            'fails': -2.5,
            'low average': -1.5,
            'low grades': -1.5,
            'hard to pass': -2.0
        }
        
        # Updated department adjustments based on historical data
        self.department_adjustments = {
            # STEM (typically harder)
            'CP': -2.5,  # Computer Science
            'MA': -2.5,  # Math
            'PC': -2.0,  # Physics
            'CH': -2.0,  # Chemistry
            'BI': -1.5,  # Biology
            'ST': -1.5,  # Statistics
            
            # Business/Economics
            'BU': -1.5,  # Business
            'EC': -1.0,  # Economics
            'AC': -1.0,  # Accounting
            'FI': -1.0,  # Finance
            
            # Humanities/Arts (typically easier)
            'EN': 1.0,   # English
            'HI': 1.0,   # History
            'PP': 0.5,   # Philosophy
            'RE': 1.0,   # Religion
            'MU': 1.0,   # Music
            
            # Social Sciences
            'PS': 0.5,   # Psychology
            'SO': 1.0,   # Sociology
            'AN': 1.0,   # Anthropology
            'PO': 0.5,   # Political Science
            
            # Generally considered easier
            'ES': 1.5,   # Environmental Studies
            'UU': 1.5,   # University courses
            'GS': 1.0,   # Global Studies
            'AS': 1.0,   # Astronomy
            'AR': 1.0,   # Archaeology
            'EM': 1.5,   # Educational Studies
        }
        
        # Load stopwords
        self.stopwords = set(nltk.corpus.stopwords.words('english'))
        
    def customize_vader_lexicon(self):
        """Add domain-specific terms to VADER lexicon"""
        academic_lexicon = {
            'easy': 2.0,
            'straightforward': 1.5,
            'manageable': 1.0,
            'bird': 3.0,
            'simple': 1.5,
            'interesting': 1.0,
            'engaging': 1.0,
            'recommended': 1.5,
            'fun': 1.5,
            'enjoyable': 1.5,
            'light': 1.0,
            'minimal': 1.0,
            'online': 0.5,
            'attendance': -0.5,
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
        
        for word, score in academic_lexicon.items():
            self.sia.lexicon[word] = score
            
    def preprocess_text(self, text: str) -> str:
        text = text.lower()
        text = re.sub(r'http\S+', '', text)
        course_codes = self.course_pattern.findall(text)
        text = text.translate(str.maketrans('', '', string.punctuation))
        for code in course_codes:
            if code.lower() not in text:
                text += f" {code}"
        text = re.sub(r'\s+', ' ', text).strip()
        return text
        
    def analyze_thread(self, thread: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze sentiment of a Reddit thread and extract course mentions with improved scoring"""
        full_text = f"{thread['title']} {thread['selftext']}"
        preprocessed_text = self.preprocess_text(full_text)
        
        sentiment = self.sia.polarity_scores(preprocessed_text)
        courses_mentioned = self.extract_courses(full_text)
        
        course_sentiments = {}
        for course in courses_mentioned:
            sentences = self._find_sentences_with_course(full_text, course)
            
            course_sentiment = {
                "compound": 0,
                "pos": 0,
                "neg": 0,
                "neu": 0,
                "mentions": len(sentences),
                "bird_terms": {},
                "context_score": 0,
                "experience_score": 0,
                "title_mention": False,
                "structured_topics": {
                    "workload": 0,
                    "difficulty": 0,
                    "enjoyment": 0,
                    "grading": 0,
                    "teaching": 0
                }
            }
            
            if sentences:
                total_bird_score = 0
                sentence_weights = []
                
                for sentence in sentences:
                    processed_sentence = self.preprocess_text(sentence)
                    
                    sent = self.sia.polarity_scores(processed_sentence)
                    
                    weight = 1.0
                    if course in sentence:
                        weight *= 1.5
                    if any(term in sentence.lower() for term in ['highly', 'very', 'really', 'definitely', 'absolutely']):
                        weight *= 1.3
                    
                    bird_term_score = self.detect_bird_terms(processed_sentence)
                    bird_terms = self.detect_bird_terms_dict(processed_sentence)
                    
                    for term, count in bird_terms.items():
                        if term in course_sentiment["bird_terms"]:
                            course_sentiment["bird_terms"][term] += count
                        else:
                            course_sentiment["bird_terms"][term] = count
                    
                    sent["compound"] = min(1.0, max(-1.0, sent["compound"] + (bird_term_score * 0.4)))
                    
                    sentence_weights.append(weight)
                    course_sentiment["compound"] += sent["compound"] * weight
                    course_sentiment["pos"] += sent["pos"] * weight
                    course_sentiment["neg"] += sent["neg"] * weight
                    course_sentiment["neu"] += sent["neu"] * weight
                    total_bird_score += bird_term_score * weight
                    
                    self._update_structured_topics(sentence.lower(), course_sentiment["structured_topics"])
                
                total_weight = sum(sentence_weights)
                if total_weight > 0:
                    course_sentiment["compound"] /= total_weight
                    course_sentiment["pos"] /= total_weight
                    course_sentiment["neg"] /= total_weight
                    course_sentiment["neu"] /= total_weight
                    
                if course in thread['title'].upper():
                    course_sentiment["compound"] = min(1.0, course_sentiment["compound"] * 1.3)
                    course_sentiment["title_mention"] = True
                    
                course_sentiment["context_score"] = self._calculate_context_score(sentences, course)
                course_sentiment["experience_score"] = self._calculate_experience_score(sentences)
                
                dept_code = course[:2]
                if dept_code in self.department_adjustments:
                    adjustment = self.department_adjustments[dept_code]
                    if adjustment < 0 and course_sentiment["compound"] > 0:
                        course_sentiment["compound"] = max(-1.0, course_sentiment["compound"] + adjustment)
                    elif adjustment > 0:
                        course_sentiment["compound"] = min(1.0, course_sentiment["compound"] + adjustment)
            
            course_sentiments[course] = course_sentiment
        
        thread_with_sentiment = thread.copy()
        thread_with_sentiment["sentiment"] = sentiment
        thread_with_sentiment["courses"] = course_sentiments
        
        return thread_with_sentiment

    def _update_structured_topics(self, text: str, topics: Dict[str, int]) -> None:
        """Update structured topic scores based on text content"""
        if any(term in text for term in ['work', 'workload', 'assignment', 'homework', 'project']):
            if any(term in text for term in ['little', 'minimal', 'light', 'easy']):
                topics['workload'] += 1
            elif any(term in text for term in ['heavy', 'lot', 'tons', 'much']):
                topics['workload'] -= 1
        
        if any(term in text for term in ['difficult', 'hard', 'tough', 'easy', 'simple']):
            if any(term in text for term in ['not', 'isn\'t', 'very easy', 'super easy']):
                topics['difficulty'] += 1
            elif any(term in text for term in ['very', 'really', 'super', 'extremely']):
                topics['difficulty'] -= 1
        
        if any(term in text for term in ['enjoy', 'fun', 'interesting', 'boring', 'hate']):
            if any(term in text for term in ['enjoy', 'fun', 'interesting', 'great']):
                topics['enjoyment'] += 1
            else:
                topics['enjoyment'] -= 1
        
        if any(term in text for term in ['grade', 'marking', 'curve', 'assessment']):
            if any(term in text for term in ['fair', 'easy', 'generous']):
                topics['grading'] += 1
            elif any(term in text for term in ['harsh', 'strict', 'tough']):
                topics['grading'] -= 1
        
        if any(term in text for term in ['professor', 'instructor', 'prof', 'teach']):
            if any(term in text for term in ['good', 'great', 'amazing', 'helpful']):
                topics['teaching'] += 1
            elif any(term in text for term in ['bad', 'terrible', 'unhelpful']):
                topics['teaching'] -= 1

    def _calculate_context_score(self, sentences: List[str], course: str) -> float:
        """Calculate a context score based on course discussion context"""
        score = 0.0
        for sentence in sentences:
            text = sentence.lower()
            
            if any(term in text for term in ['basic', 'fundamental', 'introduction', 'beginner']):
                score += 0.5
            elif any(term in text for term in ['advanced', 'complex', 'depth', 'theoretical']):
                score -= 0.5
            
            if any(term in text for term in ['open book', 'take home', 'no exam']):
                score += 0.7
            elif any(term in text for term in ['closed book', 'timed exam', 'strict deadline']):
                score -= 0.7
            
            if any(term in text for term in ['well organized', 'clear', 'structured']):
                score += 0.3
            elif any(term in text for term in ['disorganized', 'unclear', 'confusing']):
                score -= 0.3
        
        return max(-1.0, min(1.0, score))

    def _calculate_experience_score(self, sentences: List[str]) -> float:
        """Calculate an experience score based on student experiences"""
        score = 0.0
        for sentence in sentences:
            text = sentence.lower()
            
            if any(term in text for term in ['i enjoyed', 'i liked', 'i recommend']):
                score += 0.8
            elif any(term in text for term in ['i hated', 'i struggled', 'i wouldn\'t recommend']):
                score -= 0.8
            
            if any(term in text for term in ['got an a', 'did well', 'easy grade']):
                score += 0.6
            elif any(term in text for term in ['failed', 'dropped', 'withdrew']):
                score -= 0.6
            
            if any(term in text for term in ['worth it', 'good balance', 'reasonable']):
                score += 0.4
            elif any(term in text for term in ['not worth', 'waste of time', 'unfair']):
                score -= 0.4
        
        return max(-1.0, min(1.0, score))
    
    def detect_bird_terms(self, text: str) -> float:
        text = text.lower()
        score = 0.0
        for term, value in self.bird_terms.items():
            if term in text:
                score += value * text.count(term)
        for term, value in self.anti_bird_terms.items():
            if term in text:
                score += value * text.count(term)
        return score
    
    def detect_bird_terms_dict(self, text: str) -> Dict[str, int]:
        text = text.lower()
        found_terms = {}
        for term in self.bird_terms:
            if term in text:
                found_terms[term] = text.count(term)
        for term in self.anti_bird_terms:
            if term in text:
                found_terms[f"anti:{term}"] = text.count(term)
        return found_terms
    
    def extract_courses(self, text: str) -> List[str]:
        return list(set(self.course_pattern.findall(text)))
    
    def _find_sentences_with_course(self, text: str, course: str) -> List[str]:
        try:
            sentences = nltk.sent_tokenize(text)
            course_sentences = [sent for sent in sentences if course in sent]
            context_sentences = []
            for i, sent in enumerate(sentences):
                if course in sent:
                    if i > 0:
                        context_sentences.append(sentences[i-1])
                    if i < len(sentences) - 1:
                        context_sentences.append(sentences[i+1])
            all_sentences = course_sentences + context_sentences
            return list(set(all_sentences))
        except LookupError:
            return self._find_sentences_with_course_simple(text, course)
            
    def _find_sentences_with_course_simple(self, text: str, course: str) -> List[str]:
        rough_sentences = re.split(r'[.!?]+', text)
        direct_mentions = [sent.strip() for sent in rough_sentences if course in sent]
        indices = []
        for i, sent in enumerate(rough_sentences):
            if course in sent:
                indices.append(i)
        context_sentences = []
        for idx in indices:
            if idx > 0:
                context_sentences.append(rough_sentences[idx-1].strip())
            if idx < len(rough_sentences) - 1:
                context_sentences.append(rough_sentences[idx+1].strip())
        all_sentences = direct_mentions + context_sentences
        return [s for s in all_sentences if s]
                
    def analyze_threads(self, threads: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        analyzed_threads = []
        for thread in threads:
            analyzed_thread = self.analyze_thread(thread)
            analyzed_threads.append(analyzed_thread)
        return analyzed_threads
    
    def get_course_rankings(self, threads: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        analyzed_threads = threads
        if threads and "sentiment" not in threads[0]:
            analyzed_threads = self.analyze_threads(threads)
            
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
                
                course_data[course]["mentions"] += sentiment["mentions"]
                course_data[course]["compound"] += sentiment["compound"] * sentiment["mentions"]
                course_data[course]["pos"] += sentiment["pos"] * sentiment["mentions"]
                course_data[course]["neu"] += sentiment["neu"] * sentiment["mentions"]
                course_data[course]["neg"] += sentiment["neg"] * sentiment["mentions"]
                course_data[course]["score"] += thread["score"]
                
                for term, count in sentiment.get("bird_terms", {}).items():
                    if term in course_data[course]["bird_terms"]:
                        course_data[course]["bird_terms"][term] += count
                    else:
                        course_data[course]["bird_terms"][term] = count
                
                thread_info = {
                    "id": thread["id"],
                    "title": thread["title"],
                    "url": thread["url"],
                    "score": thread["score"],
                    "sentiment": sentiment["compound"]
                }
                
                if "title_mention" in sentiment:
                    thread_info["title_mention"] = sentiment["title_mention"]
                    
                course_data[course]["threads"].append(thread_info)
                
        for course in course_data.values():
            if course["mentions"] > 0:
                course["compound"] /= course["mentions"]
                course["pos"] /= course["mentions"]
                course["neu"] /= course["mentions"]
                course["neg"] /= course["mentions"]
                
            bird_term_score = 0
            for term, count in course["bird_terms"].items():
                if term.startswith("anti:"):
                    actual_term = term[5:]
                    bird_term_score += self.anti_bird_terms.get(actual_term, 0) * count
                else:
                    bird_term_score += self.bird_terms.get(term, 0) * count
                    
            if course["mentions"] > 0:
                bird_term_score /= course["mentions"]
                
            title_mentions = sum(1 for thread in course["threads"] if thread.get("title_mention", False))
            title_bonus = title_mentions * 0.3
                
            dept_code = course["department"]
            dept_adjustment = self.department_adjustments.get(dept_code, 0)
            
            total_comments = sum(thread.get("num_comments", 0) for thread in course["threads"])
            avg_comments = total_comments / len(course["threads"]) if course["threads"] else 0
            comment_factor = min(0.5, max(-0.5, (avg_comments - 10) / -20))
            
            course_number = 0
            try:
                numeric_part = re.search(r'\d+', course["code"])
                if numeric_part:
                    course_number = int(numeric_part.group())
            except (ValueError, AttributeError):
                pass
                
            level_adjustment = 0
            if course_number >= 300:
                level_adjustment = -0.5
            elif course_number >= 200:
                level_adjustment = -0.3
            elif course_number >= 100:
                level_adjustment = 0
                
            course["bird_score"] = (
                (course["compound"] * 2.5) +
                (min(1.5, course["mentions"] / 5)) +
                (course["pos"] * 2) -
                (course["neg"] * 3) +
                (bird_term_score * 1.5) +
                (min(0.8, course["score"] / 50)) +
                title_bonus +
                dept_adjustment +
                comment_factor +
                level_adjustment
            )
            
            course["bird_term_score"] = bird_term_score
            course["dept_adjustment"] = dept_adjustment
            course["comment_factor"] = comment_factor
            course["level_adjustment"] = level_adjustment
        
        course_list = list(course_data.values())
        course_list.sort(key=lambda x: x["bird_score"], reverse=True)
        
        return course_list