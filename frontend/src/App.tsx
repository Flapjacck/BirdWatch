import { useState, useEffect } from "react";
import Header from "./components/layout/Header";
import Hero from "./components/layout/Hero";
import Footer from "./components/layout/Footer";
import Section from "./components/Section";
import StatsCard from "./components/layout/StatsCard";
import FeaturedCourse from "./components/layout/FeaturedCourse";
import CourseGrid from "./components/courses/CourseGrid";
import ThreadList from "./components/reddit/ThreadList";
import LoadingSpinner from "./components/layout/LoadingSpinner";
import AnimatedSection from "./components/layout/AnimatedSection";
import CourseService from "./services/CourseService";
import { CourseType, RedditThreadType } from "./types/CourseTypes";

function App() {
  // State variables
  const [topCourses, setTopCourses] = useState<CourseType[]>([]);
  const [featuredCourse, setFeaturedCourse] = useState<CourseType | null>(null);
  const [recentThreads, setRecentThreads] = useState<RedditThreadType[]>([]);
  const [searchResults, setSearchResults] = useState<CourseType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch top courses
        const courses = await CourseService.getTopCourses(8);
        setTopCourses(courses);

        // Get featured course
        const featured = await CourseService.getFeaturedCourse();
        setFeaturedCourse(featured);

        // Fetch recent threads
        const threads = await CourseService.getRecentThreads(6);
        setRecentThreads(threads);

        // Data loading complete
        setIsLoading(false);

        // Small delay to trigger animations
        setTimeout(() => {
          setIsLoaded(true);
        }, 300);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    try {
      const results = await CourseService.searchCourses(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching courses:", error);
      setSearchResults([]);
    }
  };

  // Calculate stats from the course data
  const calculateStats = () => {
    if (topCourses.length === 0)
      return {
        totalCourses: 0,
        avgBirdScore: 0,
        onlineAvailable: 0,
        totalMentions: 0,
      };

    const onlineAvailable = topCourses.filter(
      (course) => course.is_online_available
    ).length;
    const totalMentions = topCourses.reduce(
      (sum, course) => sum + course.specific_mentions,
      0
    );
    const avgBirdScore =
      topCourses.reduce((sum, course) => sum + course.bird_score, 0) /
      topCourses.length;

    return {
      totalCourses: topCourses.length,
      avgBirdScore: avgBirdScore.toFixed(1),
      onlineAvailable,
      totalMentions,
    };
  };

  const stats = calculateStats();

  // Initial loading state
  if (isLoading && !isSearching && !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" text="Loading BirdWatch data..." />
          <p className="mt-4 text-gray-600 max-w-md mx-auto">
            We're analyzing course data from Reddit discussions to find the best
            bird courses for you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      <Header title="BirdWatch" />

      {/* Hero Section */}
      <Hero onSearch={handleSearch} />

      {/* Search Results Section (shown only when searching) */}
      {isSearching && (
        <AnimatedSection>
          <Section
            title={`Search Results: ${searchQuery}`}
            className="bg-white"
          >
            <CourseGrid
              courses={searchResults}
              loading={isLoading}
              showDetailed={true}
            />
            {!isLoading && searchResults.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsSearching(false)}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </Section>
        </AnimatedSection>
      )}

      {/* Featured Course (hidden when searching) */}
      {!isSearching && (
        <AnimatedSection>
          <Section title="Featured Bird Course" className="bg-white">
            <FeaturedCourse course={featuredCourse} isLoaded={isLoaded} />
          </Section>
        </AnimatedSection>
      )}

      {/* Stats Section (hidden when searching) */}
      {!isSearching && (
        <AnimatedSection delay={100}>
          <Section title="BirdWatch Statistics" className="bg-gray-50 py-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Courses Analyzed"
                value={stats.totalCourses}
                icon={
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
              <StatsCard
                title="Avg. Bird Score"
                value={stats.avgBirdScore}
                icon={
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                }
              />
              <StatsCard
                title="Online Available"
                value={stats.onlineAvailable}
                icon={
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
              <StatsCard
                title="Total Mentions"
                value={stats.totalMentions}
                icon={
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
            </div>
          </Section>
        </AnimatedSection>
      )}

      {/* Top Bird Courses (hidden when searching) */}
      {!isSearching && (
        <AnimatedSection delay={200}>
          <Section title="Top Bird Courses" className="bg-white">
            <CourseGrid courses={topCourses} loading={isLoading} />
          </Section>
        </AnimatedSection>
      )}

      {/* Trending Discussions (hidden when searching) */}
      {!isSearching && (
        <AnimatedSection delay={300}>
          <Section title="Trending Discussions" className="bg-gray-50">
            <ThreadList threads={recentThreads} loading={isLoading} />
          </Section>
        </AnimatedSection>
      )}

      {/* About Section */}
      <AnimatedSection delay={400}>
        <Section title="About BirdWatch" className="bg-white">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-gray-700">
              BirdWatch analyzes thousands of Reddit threads to identify and
              rank "bird courses" based on student discussions. Our advanced
              sentiment analysis algorithm processes mentions, context, and
              sentiment to generate accurate bird scores.
            </p>
            <p className="text-gray-700">
              This tool helps students make informed decisions about their
              course selections. All data is sourced from public Reddit
              discussions and updated regularly.
            </p>
          </div>
        </Section>
      </AnimatedSection>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
