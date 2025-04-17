import React from "react";
import { RedditThreadType } from "../../types/CourseTypes";

interface RedditThreadProps {
  thread: RedditThreadType;
}

const RedditThread: React.FC<RedditThreadProps> = ({ thread }) => {
  // Format the date to a readable string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  // Determine sentiment color
  const getSentimentColor = () => {
    if (!thread.sentiment) return "bg-gray-100";

    const { compound } = thread.sentiment;
    if (compound > 0.5) return "bg-green-50 border-green-200";
    if (compound > 0) return "bg-blue-50 border-blue-200";
    if (compound > -0.5) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <a
      href={thread.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-lg border p-4 shadow-sm transition-all duration-300 hover:shadow-md ${getSentimentColor()}`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-2 pr-2 transition-colors">
          {thread.title}
        </h3>
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-orange-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 10-1.414-1.414L11 10.586V7z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {thread.score}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {thread.num_comments}
            </span>
          </div>
        </div>
      </div>

      {thread.selftext && thread.selftext.length > 0 && (
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {thread.selftext.length > 150
            ? `${thread.selftext.substring(0, 150)}...`
            : thread.selftext}
        </p>
      )}

      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Posted by u/{thread.author}
        </span>
        <span className="text-xs text-gray-500">
          {formatDate(thread.created)}
        </span>
      </div>

      {thread.sentiment && (
        <div className="mt-2 flex items-center">
          <div className="text-xs mr-2 text-gray-600">Sentiment:</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${
                thread.sentiment.compound > 0.5
                  ? "bg-green-500"
                  : thread.sentiment.compound > 0
                  ? "bg-blue-500"
                  : thread.sentiment.compound > -0.5
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, (thread.sentiment.compound + 1) * 50)
                )}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {thread.courses && Object.keys(thread.courses).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {Object.keys(thread.courses).map((code) => (
            <span
              key={code}
              className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800"
            >
              {code}
            </span>
          ))}
        </div>
      )}
    </a>
  );
};

export default RedditThread;
