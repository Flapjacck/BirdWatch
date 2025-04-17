export interface CourseType {
  code: string;
  department: string;
  specific_mentions: number;
  avg_thread_score: number;
  recent_mentions: number;
  oldest_thread_date: string;
  newest_thread_date: string;
  is_online_available: boolean;
  bird_score: number;
  discussion_topics: {
    difficulty: number;
    workload: number;
    bird_course: number;
    content: number;
    structure: number;
    grading: number;
  };
  course_components: {
    exams: {
      midterm: number;
      final: number;
      total: number;
      weight_mentioned: boolean;
      difficulty_mentioned: boolean;
    };
    assignments: {
      count: number;
      papers: number;
      total: number;
      weight_mentioned: boolean;
      difficulty_mentioned: boolean;
    };
    assessments: {
      quizzes: number;
      labs: number;
      attendance: number;
      participation: number;
      presentations: number;
      projects: number;
      group_work: number;
    };
  };
  sentiment_analysis?: {
    positive_aspects?: Record<string, number>;
    negative_aspects?: Record<string, number>;
    bird_terms?: Record<string, number>;
  };
  context_clues?: {
    terms?: Record<string, number>;
    year_level_appropriate?: boolean;
    pre_requisites_mentioned?: boolean;
  };
  thread_summary?: {
    post_dates?: string[];
    scores?: number[];
    comments?: number[];
    titles?: string[];
  };
  threads?: RedditThreadType[];
}

export interface RedditThreadType {
  id: string;
  title: string;
  author: string;
  created: string;
  url: string;
  selftext?: string;
  score: number;
  num_comments: number;
  upvote_ratio?: number;
  search_type?: string;
  sentiment?: {
    neg: number;
    neu: number;
    pos: number;
    compound: number;
  };
  courses?: Record<string, any>;
}