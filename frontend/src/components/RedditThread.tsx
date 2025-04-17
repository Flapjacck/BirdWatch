import React, { useState } from "react";

interface RedditThreadProps {
  title: string;
  author: string;
  score: number;
  numComments: number;
  url: string;
  created: string;
}

const RedditThread: React.FC<RedditThreadProps> = ({
  title,
  author,
  score,
  numComments,
  url,
  created,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const formattedDate = new Date(created).toLocaleDateString();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 
                 ${
                   isHovered ? "shadow-xl -translate-y-2 border-blue-300" : ""
                 }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3
        className={`mb-2 text-lg font-semibold transition-colors duration-300 ${
          isHovered ? "text-blue-600" : "text-gray-800"
        }`}
      >
        {title}
      </h3>
      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
        <span
          className={`flex items-center transition-transform duration-300 ${
            isHovered ? "scale-110" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          {author}
        </span>
        <span className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-4 w-4"
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
          {formattedDate}
        </span>
        <span
          className={`flex items-center transition-all duration-300 ${
            isHovered ? "text-green-600 font-medium" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          {score}
        </span>
        <span
          className={`flex items-center transition-all duration-300 ${
            isHovered ? "text-blue-600 font-medium" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-4 w-4"
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
          {numComments}
        </span>
      </div>
    </a>
  );
};

export default RedditThread;
