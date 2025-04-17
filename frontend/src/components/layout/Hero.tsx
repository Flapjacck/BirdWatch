import React from "react";
import SearchBar from "./SearchBar";

interface HeroProps {
  onSearch: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  return (
    <div className="bg-gradient-to-b from-blue-600 to-blue-400 py-20 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-4 text-5xl font-bold hero-title">
          Find Your Perfect Bird Course
        </h1>
        <p className="mb-8 text-xl max-w-2xl mx-auto hero-subtitle">
          Discover the easiest courses at Laurier based on real student
          discussions and data-driven insights
        </p>
        <div className="mx-auto max-w-lg search-box">
          <SearchBar onSearch={onSearch} />
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
            <span className="text-sm">8-10: Very Easy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-400"></div>
            <span className="text-sm">6-8: Easy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-400"></div>
            <span className="text-sm">4-6: Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <span className="text-sm">0-4: Challenging</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
