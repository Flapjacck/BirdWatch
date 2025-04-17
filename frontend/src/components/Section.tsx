import React, { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">{title}</h2>
        {children}
      </div>
    </section>
  );
};

export default Section;
