import React, { useState } from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <svg
              className="h-8 w-8 text-blue-600"
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
            <h1 className="ml-2 text-2xl font-bold text-gray-800">{title}</h1>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Top Courses
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Discussions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  About
                </a>
              </li>
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="border-t border-gray-200 py-2">
              <nav className="flex flex-col space-y-3 py-3">
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  Top Courses
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  Discussions
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  About
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
