import React, { useState, useEffect } from "react";
import { CourseType } from "../../types/CourseTypes";

interface FeaturedCourseProps {
  course: CourseType | null;
  isLoaded: boolean;
}

const FeaturedCourse: React.FC<FeaturedCourseProps> = ({
  course,
  isLoaded,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Reset details state when course changes
  useEffect(() => {
    setShowDetails(false);
  }, [course]);

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl p-8 rounded-xl bg-gray-100 animate-pulse">
        <div className="h-8 w-48 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-300 rounded mb-4"></div>
        <div className="h-10 w-40 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div
        className={`overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-0.5 shadow-lg transition-all duration-700 ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="rounded-lg bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-gray-800">
                {course.code}
              </h3>
              <p className="text-gray-600">{course.department}</p>
            </div>
            <div className="text-center">
              <span className="block rounded-full bg-green-100 px-4 py-2 text-lg font-bold text-green-800">
                {course.bird_score.toFixed(1)}/10
              </span>
              <span className="mt-1 block text-xs text-gray-600">
                Bird Score
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-1 flex justify-between text-sm">
              <span>Difficulty Level</span>
              <span className="font-medium">
                {course.bird_score >= 8
                  ? "Very Easy"
                  : course.bird_score >= 7
                  ? "Easy"
                  : course.bird_score >= 6
                  ? "Moderate"
                  : "Challenging"}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                  course.bird_score >= 8
                    ? "bg-green-500"
                    : course.bird_score >= 6
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}
                style={{
                  width: isLoaded
                    ? `${Math.min(100, course.bird_score * 10)}%`
                    : "0%",
                }}
              ></div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-3 text-center shadow-sm">
              <div className="text-xl font-bold text-blue-600">
                {course.specific_mentions}
              </div>
              <div className="text-xs text-gray-600">Mentions</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center shadow-sm">
              <div className="text-xl font-bold text-blue-600">
                {course.course_components.exams.total}
              </div>
              <div className="text-xs text-gray-600">Exams</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center shadow-sm">
              <div className="text-xl font-bold text-blue-600">
                {course.course_components.assignments.total}
              </div>
              <div className="text-xs text-gray-600">Assignments</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center shadow-sm">
              <div className="text-xl font-bold text-blue-600">
                {course.discussion_topics.bird_course}
              </div>
              <div className="text-xs text-gray-600">Bird Mentions</div>
            </div>
          </div>

          {showDetails && (
            <div className="mb-6 animate-fade-in rounded-lg bg-blue-50 p-4">
              <h4 className="mb-2 font-semibold text-blue-800">
                Course Details
              </h4>

              <div className="mb-3 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-600">
                    First Mentioned:
                  </span>
                  <p className="text-sm font-medium">
                    {new Date(course.oldest_thread_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">
                    Latest Mentioned:
                  </span>
                  <p className="text-sm font-medium">
                    {new Date(course.newest_thread_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">
                    Online Available:
                  </span>
                  <p className="text-sm font-medium">
                    {course.is_online_available ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">
                    Average Thread Score:
                  </span>
                  <p className="text-sm font-medium">
                    {course.avg_thread_score.toFixed(1)}
                  </p>
                </div>
              </div>

              <h5 className="mb-1 mt-3 text-sm font-semibold text-blue-800">
                Discussion Topic Mentions
              </h5>
              <div className="mb-3 grid grid-cols-3 gap-2">
                <div className="rounded bg-white p-2 text-center shadow-sm">
                  <div className="text-sm font-bold">
                    {course.discussion_topics.difficulty}
                  </div>
                  <div className="text-xs text-gray-600">Difficulty</div>
                </div>
                <div className="rounded bg-white p-2 text-center shadow-sm">
                  <div className="text-sm font-bold">
                    {course.discussion_topics.workload}
                  </div>
                  <div className="text-xs text-gray-600">Workload</div>
                </div>
                <div className="rounded bg-white p-2 text-center shadow-sm">
                  <div className="text-sm font-bold">
                    {course.discussion_topics.grading}
                  </div>
                  <div className="text-xs text-gray-600">Grading</div>
                </div>
              </div>

              <h5 className="mb-1 mt-3 text-sm font-semibold text-blue-800">
                Course Components
              </h5>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <span className="text-xs text-gray-600">Midterms:</span>
                  <p className="text-sm font-medium">
                    {course.course_components.exams.midterm}
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-xs text-gray-600">Finals:</span>
                  <p className="text-sm font-medium">
                    {course.course_components.exams.final}
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-xs text-gray-600">Quizzes:</span>
                  <p className="text-sm font-medium">
                    {course.course_components.assessments.quizzes}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
            <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors">
              View Full Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCourse;
