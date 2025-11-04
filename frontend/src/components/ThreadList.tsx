import React from "react";

interface Thread {
  title: string;
  url: string;
  score: number;
  created: string;
}

interface ThreadListProps {
  threads: Thread[];
}

export const ThreadList: React.FC<ThreadListProps> = ({ threads }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {threads.map((thread, index) => (
        <a
          key={index}
          href={thread.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-gray-100 font-medium">{thread.title}</h3>
              <p className="text-gray-400 text-sm mt-1">
                Posted {formatDate(thread.created)}
              </p>
            </div>
            <div className="ml-4 flex items-center text-gray-400">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              {thread.score}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
