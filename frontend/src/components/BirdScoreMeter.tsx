import React from "react";

interface BirdScoreMeterProps {
  score: number;
}

export const BirdScoreMeter: React.FC<BirdScoreMeterProps> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500 stroke-green-500";
    if (score >= 6) return "text-blue-500 stroke-blue-500";
    return "text-red-500 stroke-red-500";
  };

  return (
    <div className="flex flex-col items-center transform transition-transform hover:scale-105">
      <div className="relative w-24 h-24">
        <svg
          className="transform -rotate-90 transition-all duration-1000 ease-out"
          viewBox="0 0 36 36"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-current text-gray-700 transition-all duration-300"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className={`${getScoreColor(
              score
            )} transition-all duration-1000 ease-out`}
            strokeWidth="3"
            strokeDasharray={`${(score / 10) * 100} 100`}
            strokeLinecap="round"
          >
            <animate
              attributeName="stroke-dasharray"
              from="0 100"
              to={`${(score / 10) * 100} 100`}
              dur="1.5s"
              fill="freeze"
              calcMode="spline"
              keySplines="0.4 0 0.2 1"
            />
          </circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-300">
          <span className={`text-xl font-bold ${getScoreColor(score)}`}>
            {score.toFixed(1)}
          </span>
        </div>
      </div>
      <span className="mt-2 text-sm text-gray-400 transition-colors">
        Bird Score
      </span>
    </div>
  );
};
