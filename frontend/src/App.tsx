import { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CourseCard } from "./components/CourseCard";
import { CourseDetails } from "./components/CourseDetails";
import { HowItWorks } from "./components/HowItWorks";

interface Course {
  code: string;
  department: string;
  bird_score: number;
  specific_mentions: number;
  is_online_available: boolean;
  difficulty_level: {
    easy_mentions: number;
    hard_mentions: number;
    workload: number;
  };
  course_structure: {
    has_finals: boolean;
    has_midterms: boolean;
    has_assignments: boolean;
    has_projects: boolean;
  };
  threads: Array<{
    title: string;
    url: string;
    score: number;
    created: string;
  }>;
}

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [loading, setLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        let response = await fetch("./course_details/index.json");
        if (!response.ok) {
          response = await fetch("/course_details/index.json");
          if (!response.ok) throw new Error("Failed to load course index");
        }
        const courseList = await response.json();

        const coursesData = await Promise.all(
          courseList.map(async (code: string) => {
            let courseResponse = await fetch(`./course_details/${code}.json`);
            if (!courseResponse.ok) {
              courseResponse = await fetch(`/course_details/${code}.json`);
              if (!courseResponse.ok)
                throw new Error(`Failed to load course ${code}`);
            }
            return courseResponse.json();
          })
        );

        coursesData.sort((a, b) => b.bird_score - a.bird_score);
        setCourses(coursesData);
        setFilteredCourses(coursesData);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleSearch = (query: string) => {
    const filtered = courses.filter(
      (course) =>
        course.code.toLowerCase().includes(query.toLowerCase()) ||
        (course.department &&
          course.department.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredCourses(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="relative animate-pulse-gentle">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/20 border-t-blue-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500/10 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header
        onSearch={handleSearch}
        onHowItWorksClick={() => setShowHowItWorks(true)}
      />
      <div className="pt-24">
        <Hero />

        <main
          ref={mainRef}
          id="courses-section"
          className="container mx-auto px-4 py-16"
        >
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              Available Courses
              <span className="text-lg font-normal text-gray-400">
                ({filteredCourses.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <div
                  key={course.code}
                  className="animate-fade-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <CourseCard
                    code={course.code}
                    department={course.department}
                    birdScore={course.bird_score}
                    mentions={course.specific_mentions}
                    isOnline={course.is_online_available}
                    difficulty={course.difficulty_level}
                    onClick={() => setSelectedCourse(course)}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <footer className="border-t border-gray-800 mt-auto py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="text-sm space-y-2">
            <span className="block">
              Made by{" "}
              <a
                href="https://SpencerKelly.tech/"
                className="text-blue-400 hover:text-blue-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spencer Kelly
              </a>
              {" • "}
              <a
                href="https://github.com/Flapjacck/BirdWatch"
                className="text-blue-400 hover:text-blue-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Repo
              </a>
            </span>
            <span className="block">
              Think something is off? Contact me on Discord:{" "}
              <span className="text-blue-400">Flapjacck</span>
            </span>
          </p>
        </div>
      </footer>

      {selectedCourse && (
        <CourseDetails
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {showHowItWorks && (
        <HowItWorks onClose={() => setShowHowItWorks(false)} />
      )}
    </div>
  );
}

export default App;
