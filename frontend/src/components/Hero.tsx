import React, { useEffect, useState } from "react";

export const Hero: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-[calc(100vh-4rem)] min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden pb-16">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 animate-gradient-shift"></div>

      {/* Floating shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-xl animate-float-slower"></div>
        <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-cyan-500/20 rounded-full blur-xl animate-float"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mb-16">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
          BirdWatch
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-12 animate-fade-in-delay">
          Tracking the chirps that boost your GPA
        </p>
        <button
          onClick={() => {
            const coursesSection = document.getElementById("courses-section");
            coursesSection?.scrollIntoView({ behavior: "smooth" });
          }}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-medium tracking-wide text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Explore Courses
          <svg
            className="w-5 h-5 ml-2 transform group-hover:translate-y-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>

      {/* Scroll indicator */}
      <div
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 z-20 ${
          scrolled ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
