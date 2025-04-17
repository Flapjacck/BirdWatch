import React from "react";
import RedditThread from "./RedditThread";
import { RedditThreadType } from "../../types/CourseTypes";

interface ThreadListProps {
  threads: RedditThreadType[];
  title?: string;
  loading?: boolean;
}

const ThreadList: React.FC<ThreadListProps> = ({
  threads,
  title,
  loading = false,
}) => {
  const renderThreads = () => {
    if (loading) {
      // Render loading skeleton
      return Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg bg-gray-100 p-4 shadow-sm animate-pulse"
        >
          <div className="h-5 w-3/4 bg-gray-300 rounded-md mb-4"></div>
          <div className="h-4 w-full bg-gray-300 rounded-md mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-300 rounded-md mb-4"></div>
          <div className="flex justify-between">
            <div className="h-3 w-20 bg-gray-300 rounded-md"></div>
            <div className="h-3 w-16 bg-gray-300 rounded-md"></div>
          </div>
        </div>
      ));
    }

    if (threads.length === 0) {
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
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">
            No threads found
          </h3>
          <p className="mt-1 text-gray-500">
            Check back later for new discussions.
          </p>
        </div>
      );
    }

    return threads.map((thread) => (
      <RedditThread key={thread.id} thread={thread} />
    ));
  };

  return (
    <div>
      {title && (
        <h2 className="mb-4 text-2xl font-bold text-gray-800">{title}</h2>
      )}
      <div className="grid gap-6 md:grid-cols-2">{renderThreads()}</div>
    </div>
  );
};

export default ThreadList;
