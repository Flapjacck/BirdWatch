import React from "react";
import CourseCard from "./CourseCard";
import { CourseType } from "../../types/CourseTypes";

interface CourseGridProps {
  courses: CourseType[];
  title?: string;
  showDetailed?: boolean;
  loading?: boolean;
}

const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  title,
  showDetailed = false,
  loading = false,
}) => {
  const renderCourseCards = () => {
    if (loading) {
      // Render loading skeleton
      return Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg bg-gray-100 p-5 shadow-md animate-pulse"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-16 bg-gray-300 rounded-md"></div>
            <div className="h-6 w-10 bg-gray-300 rounded-full"></div>
          </div>
          <div className="h-4 w-24 bg-gray-300 rounded-md mb-2"></div>
          <div className="mt-4 h-2 w-full bg-gray-300 rounded-full"></div>
        </div>
      ));
    }

    if (courses.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
          <svg
            className="h-12 w-12 text-gray-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">
            No courses found
          </h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filters.
          </p>
        </div>
      );
    }

    return courses.map((course) => (
      <CourseCard key={course.code} course={course} detailed={showDetailed} />
    ));
  };

  return (
    <div>
      {title && (
        <h2 className="mb-4 text-2xl font-bold text-gray-800">{title}</h2>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {renderCourseCards()}
      </div>
    </div>
  );
};

export default CourseGrid;
