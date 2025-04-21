import React from "react";

interface HeaderProps {
  onSearch: (query: string) => void;
  onHowItWorksClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onHowItWorksClick,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm shadow-lg z-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-blue-400">BirdWatch</h1>
            <select
              className="px-2 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:border-blue-500 text-sm"
              defaultValue="WLU"
            >
              <option value="WLU">WLU</option>
              <option value="TBA" disabled>
                TBA
              </option>
            </select>
          </div>
          <div className="flex gap-4 w-full md:w-auto items-center">
            <div className="flex-1 md:w-96">
              <input
                type="text"
                placeholder="Search courses (e.g., EM203)"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:border-blue-500"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            <button
              onClick={onHowItWorksClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/30 transition-all duration-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="hidden md:inline">How It Works</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
