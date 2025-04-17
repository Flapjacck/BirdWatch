import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search for a course...",
  className = "",
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex rounded-lg bg-white p-1 shadow-lg ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-l-lg px-4 py-2 text-gray-700 focus:outline-none"
        aria-label="Search"
      />
      <button
        type="submit"
        className="rounded-r-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 hover:scale-105 transition-transform"
        aria-label="Submit search"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
