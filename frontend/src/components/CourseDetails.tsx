import React, { useEffect, useState } from "react";
import { BirdScoreMeter } from "./BirdScoreMeter";
import { ThreadList } from "./ThreadList";

interface CourseDetailsProps {
  course: {
    code: string;
    department: string;
    bird_score: number;
    specific_mentions: number;
    is_online_available: boolean;
    difficulty_level: {
      easy_mentions: number;
      hard_mentions: number;
      workload: number;
    };
    course_structure: {
      has_finals: boolean;
      has_midterms: boolean;
      has_assignments: boolean;
      has_projects: boolean;
    };
    threads: Array<{
      title: string;
      url: string;
      score: number;
      created: string;
    }>;
  };
  onClose: () => void;
}

export const CourseDetails: React.FC<CourseDetailsProps> = ({
  course,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sortedThreads = [...course.threads].sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setIsVisible(true));
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const getCalendarSearchUrl = (courseCode: string) => {
    const searchQuery = `${courseCode} Undergraduate Academic Calendar 2025/2026`;
    return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div
      className={`fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transition-all duration-500 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-none p-6 border-b border-gray-700/50 bg-gray-900/50 relative overflow-hidden">
          <div className="flex justify-between items-start relative">
            <div className="flex-1 max-w-[75%]">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {course.code}
                </h2>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300">
                  {course.department}
                </span>
                {course.is_online_available && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-900/50 text-blue-300 border border-blue-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block mr-1.5"></span>
                    Online Mentioned
                  </span>
                )}
              </div>

              {/* Calendar Information Section */}
              <div className="mt-2 p-2 md:mt-4 md:p-3 bg-blue-900/20 rounded-lg border border-blue-500/20 backdrop-blur-sm mr-4">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-blue-400 flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="space-y-1">
                    <h3 className="text-sm md:text-base font-medium text-blue-300">
                      Course Information
                    </h3>
                    <p className="text-xs md:text-sm text-gray-300">
                      For detailed information about this course, including
                      prerequisites, credit weight, and full course description,
                      please refer to the Academic Calendar.
                    </p>
                    <a
                      href={getCalendarSearchUrl(course.code)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-blue-500/20 hover:bg-blue-500/30 
                               text-blue-300 rounded-lg transition-colors duration-300 group mt-1 text-xs md:text-sm"
                    >
                      <span>
                        View {course.code} in Academic Calendar 2025/2026 (First
                        link)
                      </span>
                      <svg
                        className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-200 transition-colors p-1 hover:rotate-90 transform duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <BirdScoreMeter score={course.bird_score} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Left side - Course Stats */}
          <div className="md:col-span-1 bg-gray-900/30 p-6 overflow-y-auto border-r border-gray-700/30">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-300 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Course Discussion Mentions
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {course.course_structure.has_finals && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 text-gray-300">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      Finals Mentioned
                    </div>
                  )}
                  {course.course_structure.has_midterms && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 text-gray-300">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      Midterms Mentioned
                    </div>
                  )}
                  {course.course_structure.has_assignments && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 text-gray-300">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      Assignments Mentioned
                    </div>
                  )}
                  {course.course_structure.has_projects && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 text-gray-300">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      Projects Mentioned
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-300 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Discussion Statistics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400">Easy Mentions</span>
                      <span className="text-green-400 font-medium">
                        {course.difficulty_level.easy_mentions}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min(
                            100,
                            course.difficulty_level.easy_mentions * 10
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400">Hard Mentions</span>
                      <span className="text-red-400 font-medium">
                        {course.difficulty_level.hard_mentions}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min(
                            100,
                            course.difficulty_level.hard_mentions * 10
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400">Workload References</span>
                      <span className="text-yellow-400 font-medium">
                        {course.difficulty_level.workload}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min(
                            100,
                            course.difficulty_level.workload * 10
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Reddit Discussions */}
          <div className="md:col-span-2 overflow-hidden flex flex-col">
            <div className="flex-none sticky top-0 z-10 bg-gray-800/95 backdrop-blur-sm rounded-lg mx-4 mt-2 mb-1">
              <h3 className="text-base md:text-lg font-medium text-gray-100 flex items-center gap-2 p-2 md:p-3">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                Reddit Discussions
                <span className="text-xs md:text-sm font-normal text-gray-400">
                  ({course.threads.length} threads)
                </span>
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <ThreadList threads={sortedThreads} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
