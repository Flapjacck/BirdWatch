import React, { useState } from "react";
import { CourseType } from "../../types/CourseTypes";

interface CourseCardProps {
  course: CourseType;
  detailed?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  detailed = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate color based on bird score
  const getBirdScoreColor = () => {
    if (course.bird_score >= 8) return "bg-green-100 border-green-500";
    if (course.bird_score >= 6) return "bg-blue-100 border-blue-500";
    return "bg-amber-100 border-amber-500";
  };

  // Format date to display only the year
  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  return (
    <div
      className={`rounded-lg p-5 shadow-md transition-all duration-300 hover:shadow-xl ${getBirdScoreColor()} border-l-4 transform hover:-translate-y-2`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <h3
          className={`text-xl font-bold transition-all duration-300 ${
            isHovered ? "text-blue-600 scale-110" : "text-gray-800"
          }`}
        >
          {course.code}
        </h3>
        <span
          className={`rounded-full bg-white px-3 py-1 text-sm font-bold shadow transition-all duration-300 ${
            isHovered ? "scale-110" : ""
          }`}
        >
          {course.bird_score.toFixed(1)}/10
        </span>
      </div>

      <div className="mt-1 text-xs text-gray-500">{course.department}</div>

      <p className="mt-2 text-sm text-gray-600">
        Mentioned {course.specific_mentions} times
      </p>

      {course.is_online_available && (
        <span className="mt-1 inline-block rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
          Online Available
        </span>
      )}

      <div className="mt-3 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-2 rounded-full ${
            course.bird_score >= 8
              ? "bg-green-500"
              : course.bird_score >= 6
              ? "bg-blue-500"
              : "bg-amber-500"
          } transition-all duration-700 ease-in-out`}
          style={{
            width: `${Math.min(100, course.bird_score * 10)}%`,
          }}
        ></div>
      </div>

      {detailed && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">First mentioned:</span>
              <p>{formatDate(course.oldest_thread_date)}</p>
            </div>
            <div>
              <span className="text-gray-500">Latest:</span>
              <p>{formatDate(course.newest_thread_date)}</p>
            </div>
            <div>
              <span className="text-gray-500">Bird topic mentions:</span>
              <p>{course.discussion_topics.bird_course}</p>
            </div>
            <div>
              <span className="text-gray-500">Difficulty mentions:</span>
              <p>{course.discussion_topics.difficulty}</p>
            </div>
          </div>

          <div className="mt-3 flex justify-between">
            <div className="text-xs">
              <span className="text-gray-500">Exams: </span>
              <span className="font-medium">
                {course.course_components.exams.total}
              </span>
            </div>
            <div className="text-xs">
              <span className="text-gray-500">Assignments: </span>
              <span className="font-medium">
                {course.course_components.assignments.total}
              </span>
            </div>
            <div className="text-xs">
              <span className="text-gray-500">Quizzes: </span>
              <span className="font-medium">
                {course.course_components.assessments.quizzes}
              </span>
            </div>
          </div>
        </div>
      )}

      {isHovered && (
        <button className="mt-3 w-full rounded bg-blue-600 py-1 text-sm text-white hover:bg-blue-700 transition-colors">
          View Details
        </button>
      )}
    </div>
  );
};

export default CourseCard;
