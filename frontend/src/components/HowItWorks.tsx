import React, { useEffect, useState } from "react";

interface ScoreFactorProps {
  name: string;
  weight: number;
  description: string;
  color: string;
}

const ScoreFactor: React.FC<ScoreFactorProps> = ({
  name,
  weight,
  description,
  color,
}) => (
  <div className="flex flex-col gap-2 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-200">{name}</h3>
      <span className={`px-2 py-1 rounded text-sm font-medium ${color}`}>
        {weight > 0 ? "+" : ""}
        {weight.toFixed(1)}x
      </span>
    </div>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

interface HowItWorksProps {
  onClose?: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setIsVisible(true));
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const scoreFactors: ScoreFactorProps[] = [
    {
      name: "Sentiment Analysis",
      weight: 2.5,
      description:
        "Overall positive/negative sentiment from student discussions. Considers context and personal experiences.",
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      name: "Bird Terms",
      weight: 1.5,
      description:
        "Specific phrases like 'easy A', 'GPA booster', or negative terms like 'extremely difficult', 'stay away'.",
      color: "text-green-400 bg-green-500/10",
    },
    {
      name: "Department Adjustment",
      weight: -2.5,
      description:
        "STEM courses (CS, Math, Physics) typically have lower base scores, while Humanities often score higher.",
      color: "text-purple-400 bg-purple-500/10",
    },
    {
      name: "Course Level",
      weight: -0.5,
      description:
        "Higher level courses (300+) receive a penalty, while 100-level courses have no adjustment.",
      color: "text-yellow-400 bg-yellow-500/10",
    },
    {
      name: "Mention Impact",
      weight: 1.5,
      description:
        "More mentions (up to 5) increase reliability. Title mentions receive a 30% bonus.",
      color: "text-orange-400 bg-orange-500/10",
    },
    {
      name: "Reddit Score",
      weight: 0.8,
      description:
        "Popular threads (high upvotes) have more weight, capped at 50 upvotes.",
      color: "text-red-400 bg-red-500/10",
    },
  ];

  return (
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div className="min-h-screen px-4 py-12">
        <div
          className={`max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-xl border border-gray-800 transition-all duration-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  How Bird Score Works
                </h2>
                <p className="text-gray-400">
                  Bird Score is calculated using a sophisticated algorithm that
                  analyzes various factors from Reddit discussions
                </p>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-200 transition-colors p-1"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Score Components
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scoreFactors.map((factor) => (
                    <ScoreFactor key={factor.name} {...factor} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Understanding the Score
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="text-2xl font-bold text-green-500 mb-2">
                      8.0+
                    </div>
                    <div className="text-gray-300 font-medium">
                      Confirmed Bird Course
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Consistently rated easy
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="text-2xl font-bold text-blue-500 mb-2">
                      6.0-7.9
                    </div>
                    <div className="text-gray-300 font-medium">
                      Moderate Difficulty
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Mixed reviews, manageable
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="text-2xl font-bold text-red-500 mb-2">
                      &lt; 6.0
                    </div>
                    <div className="text-gray-300 font-medium">
                      Challenging Course
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Generally considered difficult
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Important Note
                </h3>
                <p className="text-gray-400 text-sm">
                  Bird Score is based on student discussions and should be used
                  as a general guide only. Course difficulty can vary by
                  professor, term, and individual student abilities. Always
                  check the detailed course information and recent reviews for
                  the most accurate assessment.
                </p>
              </div>

              <div className="text-center text-sm text-gray-400 mt-4">
                Course Information Last Updated: November 3, 2025
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
