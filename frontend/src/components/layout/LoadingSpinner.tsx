import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "blue",
  text,
}) => {
  // Determine size class
  const sizeClass = {
    small: "h-5 w-5",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  }[size];

  // Determine color class
  const colorClass =
    {
      blue: "text-blue-600",
      gray: "text-gray-600",
      white: "text-white",
      green: "text-green-600",
    }[color as "blue" | "gray" | "white" | "green"] || "text-blue-600";

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        className={`animate-spin ${sizeClass} ${colorClass}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <span className={`mt-2 ${colorClass} text-sm font-medium`}>{text}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;
