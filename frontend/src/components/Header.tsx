import React from "react";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className="bg-gray-900 shadow-lg py-6">
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
          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder="Search courses (e.g., EM203)"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:border-blue-500"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
