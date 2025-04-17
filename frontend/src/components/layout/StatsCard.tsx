import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`rounded-lg bg-white p-4 shadow-md hover:shadow-lg transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className="text-2xl font-bold text-blue-600">{value}</p>
        </div>
        {icon && (
          <div className="rounded-full bg-blue-100 p-3 text-blue-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
