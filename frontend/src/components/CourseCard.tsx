import React, { useState } from "react";
import { BirdScoreMeter } from "./BirdScoreMeter";

interface CourseCardProps {
  code: string;
  department: string;
  birdScore: number;
  mentions: number;
  isOnline: boolean;
  difficulty: {
    easy_mentions: number;
    hard_mentions: number;
    workload: number;
  };
  onClick: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  code,
  department,
  birdScore,
  mentions,
  isOnline,
  difficulty,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-900 rounded-xl p-6 
                 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1
                 border border-transparent hover:border-blue-500/10 overflow-hidden"
    >
      {/* Full card gradient animation */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 
                    bg-[length:200%_100%] pointer-events-none opacity-0 transition-all duration-700 
                    group-hover:opacity-100 group-hover:animate-gradient-shift rounded-xl`}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                {code}
              </h2>
              <p className="text-gray-400 text-sm transition-colors duration-300 group-hover:text-gray-300">
                {department}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {isOnline && (
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                               bg-blue-900/30 text-blue-300 border border-blue-500/20 group-hover:bg-blue-900/40 
                               transition-colors duration-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5 animate-pulse" />
                  Online Mentioned
                </span>
              )}
              {mentions > 0 && (
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                               bg-purple-900/30 text-purple-300 border border-purple-500/20 group-hover:bg-purple-900/40 
                               transition-colors duration-300"
                >
                  {mentions} mentions
                </span>
              )}
            </div>

            <div className="space-y-2 transition-transform duration-300 transform group-hover:translate-x-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  Discussion Activity:
                </span>
                <div className="h-2 w-36 bg-gray-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-red-500 transform origin-left transition-all duration-1000"
                    style={{
                      width: `${Math.max(
                        5,
                        Math.min(
                          100,
                          ((difficulty.easy_mentions +
                            difficulty.hard_mentions) /
                            (difficulty.easy_mentions +
                              difficulty.hard_mentions +
                              1)) *
                            100
                        )
                      )}%`,
                      transform: isHovered ? "scaleX(1.02)" : "scaleX(1)",
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-green-400 transition-opacity duration-300">
                  Easy: {difficulty.easy_mentions}
                </span>
                <span className="text-red-400 transition-opacity duration-300">
                  Hard: {difficulty.hard_mentions}
                </span>
                {difficulty.workload > 0 && (
                  <span className="text-yellow-400">
                    Workload: {difficulty.workload}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <BirdScoreMeter score={birdScore} />
          </div>
        </div>
      </div>
    </div>
  );
};
