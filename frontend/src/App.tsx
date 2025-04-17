import { useState, useEffect } from "react";
import Header from "./components/Header";
import Section from "./components/Section";
import CourseCard from "./components/CourseCard";
import RedditThread from "./components/RedditThread";

// Mock data for demonstration
const topCourses = [
  { code: "EM203", birdScore: 8.7, mentions: 42 },
  { code: "EM202", birdScore: 7.9, mentions: 38 },
  { code: "UU150", birdScore: 7.5, mentions: 29 },
  { code: "ES110", birdScore: 7.2, mentions: 31 },
  { code: "CP102", birdScore: 6.8, mentions: 25 },
  { code: "BU111", birdScore: 6.5, mentions: 22 },
  { code: "PS101", birdScore: 6.2, mentions: 19 },
  { code: "GG101", birdScore: 5.9, mentions: 15 },
];

const redditThreads = [
  {
    title: "Bird courses for Winter 2026?",
    author: "student123",
    score: 45,
    numComments: 23,
    url: "https://www.reddit.com/r/wlu/123",
    created: "2025-03-10T14:48:00.000Z",
  },
  {
    title: "Easiest courses at Laurier?",
    author: "easyA",
    score: 67,
    numComments: 41,
    url: "https://www.reddit.com/r/wlu/456",
    created: "2025-02-15T09:22:00.000Z",
  },
  {
    title: "What makes EM203 such a bird course?",
    author: "curious_student",
    score: 38,
    numComments: 19,
    url: "https://www.reddit.com/r/wlu/789",
    created: "2025-03-22T16:35:00.000Z",
  },
  {
    title: "Best bird courses for non-business students?",
    author: "artsMajor",
    score: 52,
    numComments: 27,
    url: "https://www.reddit.com/r/wlu/101",
    created: "2025-03-05T11:14:00.000Z",
  },
];

function App() {
  const [featured, setFeatured] = useState<(typeof topCourses)[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate loading the featured course
  useEffect(() => {
    // In a real app, you might fetch this from an API
    const randomIndex = Math.floor(Math.random() * 3); // Get one of the top 3

    // Add small delay to simulate loading and trigger animations
    setTimeout(() => {
      setFeatured(topCourses[randomIndex]);
      setIsLoaded(true);
    }, 300);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      <Header title="BirdWatch" />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500 to-blue-400 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold hero-title">
            Find Your Perfect Bird Course
          </h1>
          <p className="mb-8 text-xl hero-subtitle">
            Discover the easiest courses based on real student discussions
          </p>
          <div className="mx-auto max-w-lg search-box">
            <div className="flex rounded-lg bg-white p-1 shadow-lg">
              <input
                type="text"
                placeholder="Search for a course..."
                className="w-full rounded-l-lg px-4 py-2 text-gray-700 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="rounded-r-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 hover:scale-105 transition-transform">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Course */}
      {featured && (
        <Section title="Featured Bird Course" className="bg-white">
          <div className="mx-auto max-w-2xl">
            <div
              className={`overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-0.5 shadow-lg transition-all duration-700 ${
                isLoaded ? "animate-card-in" : "opacity-0"
              }`}
            >
              <div className="rounded-lg bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                    {featured.code}
                  </h3>
                  <span className="rounded-full bg-green-100 px-4 py-1 text-lg font-bold text-green-800 hover:bg-green-200 transition-colors duration-300">
                    {featured.birdScore.toFixed(1)}/10
                  </span>
                </div>
                <p className="mb-4 text-gray-600">
                  This course has been mentioned {featured.mentions} times in
                  student discussions, making it one of the top-rated bird
                  courses.
                </p>
                <div className="mb-4 h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-green-500 transition-all duration-1000 ease-out"
                    style={{
                      width: isLoaded
                        ? `${Math.min(100, featured.birdScore * 10)}%`
                        : "0%",
                    }}
                  ></div>
                </div>
                <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 hover:scale-105 transform transition-all duration-300">
                  View Course Details
                </button>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Top Bird Courses */}
      <Section title="Top Bird Courses" className="bg-gray-50">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topCourses.slice(0, 8).map((course, index) => (
            <CourseCard
              key={index}
              code={course.code}
              birdScore={course.birdScore}
              mentions={course.mentions}
            />
          ))}
        </div>
      </Section>

      {/* Trending Discussions */}
      <Section title="Trending Discussions" className="bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          {redditThreads.map((thread, index) => (
            <RedditThread
              key={index}
              title={thread.title}
              author={thread.author}
              score={thread.score}
              numComments={thread.numComments}
              url={thread.url}
              created={thread.created}
            />
          ))}
        </div>
      </Section>

      {/* About Section */}
      <Section title="About BirdWatch" className="bg-gray-50">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-gray-700">
            BirdWatch analyzes thousands of Reddit threads to identify and rank
            "bird courses" based on student discussions. Our advanced sentiment
            analysis algorithm processes mentions, context, and sentiment to
            generate accurate bird scores.
          </p>
          <p className="text-gray-700">
            This tool helps students make informed decisions about their course
            selections. All data is sourced from public Reddit discussions and
            updated regularly.
          </p>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-gray-800 py-10 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div>
              <h3 className="text-xl font-bold">BirdWatch</h3>
              <p className="text-gray-400">
                © 2025 BirdWatch. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">
                Terms
              </a>
              <a href="#" className="hover:text-blue-400">
                Privacy
              </a>
              <a href="#" className="hover:text-blue-400">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Made by{" "}
              <a
                href="https://github.com/Flapjacck/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Spencer Kelly
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
