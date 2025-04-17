import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-gradient-to-r from-cyan-500 to-blue-500 py-6 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white animate-pulse"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <h1 className="ml-2 text-3xl font-bold text-white hover:scale-105 transition-transform duration-300">
              {title}
            </h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a
                  href="#"
                  className="text-white hover:text-blue-100  hover:scale-110 inline-block transition-transform duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-blue-100  hover:scale-110 inline-block transition-transform duration-300"
                >
                  Top Courses
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-blue-100  hover:scale-110 inline-block transition-transform duration-300"
                >
                  About
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
