import { CourseType, RedditThreadType } from '../types/CourseTypes';

/**
 * Service for handling course data operations
 */
class CourseService {
  // Path to the course details JSON file
  private static readonly COURSE_DETAILS_PATH = '/backend/data/processed/course_details/latest_course_details.json';
  
  /**
   * Fetches all course details from the JSON file
   */
  public static async getAllCourses(): Promise<CourseType[]> {
    try {
      const response = await fetch(this.COURSE_DETAILS_PATH);
      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching course data:', error);
      // Return mock data for development purposes if fetch fails
      return this.getMockCourseData();
    }
  }
  
  /**
   * Gets the top courses sorted by bird score
   */
  public static async getTopCourses(limit: number = 8): Promise<CourseType[]> {
    const courses = await this.getAllCourses();
    return courses
      .sort((a, b) => b.bird_score - a.bird_score)
      .slice(0, limit);
  }
  
  /**
   * Gets recent Reddit threads related to bird courses
   */
  public static async getRecentThreads(limit: number = 8): Promise<RedditThreadType[]> {
    const courses = await this.getAllCourses();
    const allThreads: RedditThreadType[] = [];
    
    // Collect threads from all courses
    courses.forEach(course => {
      if (course.threads && course.threads.length > 0) {
        allThreads.push(...course.threads);
      }
    });
    
    // Sort by creation date (descending) and limit the results
    return allThreads
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
      .slice(0, limit);
  }
  
  /**
   * Gets a random featured course from the top 5
   */
  public static async getFeaturedCourse(): Promise<CourseType | null> {
    const topCourses = await this.getTopCourses(5);
    if (topCourses.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * Math.min(topCourses.length, 5));
    return topCourses[randomIndex];
  }
  
  /**
   * Searches for courses by code or department
   */
  public static async searchCourses(query: string): Promise<CourseType[]> {
    if (!query.trim()) {
      return [];
    }
    
    const courses = await this.getAllCourses();
    const normalizedQuery = query.toLowerCase().trim();
    
    return courses.filter(course => 
      course.code.toLowerCase().includes(normalizedQuery) || 
      course.department.toLowerCase().includes(normalizedQuery)
    );
  }
  
  /**
   * Returns mock course data for development purposes
   */
  private static getMockCourseData(): CourseType[] {
    return [
      {
        code: "EM203",
        department: "EM",
        specific_mentions: 42,
        avg_thread_score: 6.8,
        recent_mentions: 12,
        oldest_thread_date: "2021-01-15T00:00:00.000Z",
        newest_thread_date: "2025-03-22T00:00:00.000Z",
        is_online_available: true,
        bird_score: 8.7,
        discussion_topics: {
          difficulty: 2,
          workload: 3,
          bird_course: 15,
          content: 5,
          structure: 2,
          grading: 3
        },
        course_components: {
          exams: {
            midterm: 1,
            final: 1,
            total: 2,
            weight_mentioned: true,
            difficulty_mentioned: true
          },
          assignments: {
            count: 4,
            papers: 0,
            total: 4,
            weight_mentioned: true,
            difficulty_mentioned: true
          },
          assessments: {
            quizzes: 2,
            labs: 0,
            attendance: 1,
            participation: 1,
            presentations: 0,
            projects: 0,
            group_work: 0
          }
        }
      },
      {
        code: "EM202",
        department: "EM",
        specific_mentions: 38,
        avg_thread_score: 6.5,
        recent_mentions: 10,
        oldest_thread_date: "2021-02-10T00:00:00.000Z",
        newest_thread_date: "2025-03-15T00:00:00.000Z",
        is_online_available: true,
        bird_score: 7.9,
        discussion_topics: {
          difficulty: 3,
          workload: 4,
          bird_course: 12,
          content: 4,
          structure: 3,
          grading: 2
        },
        course_components: {
          exams: {
            midterm: 1,
            final: 1,
            total: 2,
            weight_mentioned: true,
            difficulty_mentioned: true
          },
          assignments: {
            count: 3,
            papers: 1,
            total: 4,
            weight_mentioned: true,
            difficulty_mentioned: true
          },
          assessments: {
            quizzes: 3,
            labs: 0,
            attendance: 0,
            participation: 1,
            presentations: 0,
            projects: 1,
            group_work: 1
          }
        }
      },
      {
        code: "UU150",
        department: "UU",
        specific_mentions: 29,
        avg_thread_score: 6.2,
        recent_mentions: 8,
        oldest_thread_date: "2021-03-05T00:00:00.000Z",
        newest_thread_date: "2025-03-10T00:00:00.000Z",
        is_online_available: true,
        bird_score: 7.5,
        discussion_topics: {
          difficulty: 2,
          workload: 2,
          bird_course: 10,
          content: 3,
          structure: 2,
          grading: 1
        },
        course_components: {
          exams: {
            midterm: 0,
            final: 0,
            total: 0,
            weight_mentioned: false,
            difficulty_mentioned: false
          },
          assignments: {
            count: 5,
            papers: 0,
            total: 5,
            weight_mentioned: true,
            difficulty_mentioned: false
          },
          assessments: {
            quizzes: 4,
            labs: 0,
            attendance: 0,
            participation: 1,
            presentations: 0,
            projects: 0,
            group_work: 0
          }
        }
      }
    ];
  }
}

export default CourseService;