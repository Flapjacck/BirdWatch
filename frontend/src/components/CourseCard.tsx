import React, { useState } from "react";

interface CourseProps {
  code: string;
  birdScore: number;
  mentions: number;
}

const CourseCard: React.FC<CourseProps> = ({ code, birdScore, mentions }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate color based on bird score
  const getBirdScoreColor = () => {
    if (birdScore >= 8) return "bg-green-100 border-green-500";
    if (birdScore >= 6) return "bg-blue-100 border-blue-500";
    return "bg-amber-100 border-amber-500";
  };

  return (
    <div
      className={`rounded-lg p-5 shadow-md transition-all duration-300 hover:shadow-xl ${getBirdScoreColor()} border-l-4 transform hover:-translate-y-2`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <h3
          className={`text-xl font-bold transition-all duration-300 ${
            isHovered ? "text-blue-600 scale-110" : "text-gray-800"
          }`}
        >
          {code}
        </h3>
        <span
          className={`rounded-full bg-white px-3 py-1 text-sm font-bold shadow transition-all duration-300 ${
            isHovered ? "scale-110" : ""
          }`}
        >
          {birdScore.toFixed(1)}/10
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">Mentioned {mentions} times</p>
      <div className="mt-3 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-2 rounded-full ${
            birdScore >= 8
              ? "bg-green-500"
              : birdScore >= 6
              ? "bg-blue-500"
              : "bg-amber-500"
          } transition-all duration-700 ease-in-out`}
          style={{
            width: isHovered ? `${Math.min(100, birdScore * 10)}%` : "0%",
          }}
        ></div>
      </div>
    </div>
  );
};

export default CourseCard;
