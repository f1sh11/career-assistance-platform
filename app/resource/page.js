//resourcepage
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// 资源卡片组件
function ResourceCard({ resource, scrollTop, index, lastIndex }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleVisibility = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const distanceFromTop = rect.top;
      const disappearThreshold = 150;
      const bottomPreserveBuffer = 4;

      if (index >= lastIndex - bottomPreserveBuffer) {
        setVisible(true);
      } else {
        setVisible(distanceFromTop >= disappearThreshold);
      }
    };

    handleVisibility();
    window.addEventListener("scroll", handleVisibility);
    window.addEventListener("resize", handleVisibility);
    return () => {
      window.removeEventListener("scroll", handleVisibility);
      window.removeEventListener("resize", handleVisibility);
    };
  }, [scrollTop, index, lastIndex]);

  return (
    <div
      ref={ref}
      className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <h2 className="text-2xl font-semibold mb-4 text-black">{resource.title}</h2>
      <p className="text-gray-700">{resource.description}</p>
    </div>
  );
}

export default function ResourcePage() {
  const [selectedCategory, setSelectedCategory] = useState("Career Guides");
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollTop, setScrollTop] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [searchText, setSearchText] = useState("");

  const categories = [
    "Career Guides",
    "Templates",
    "AI tool",
    "Interview Preparation",
    "Company Profiles",
    "Skill Development Courses",
    "Psychological Tests",
  ];

  const resourcesData = {
    "Career Guides": Array.from({ length: 34 }, (_, i) => ({
      title: `Career Guide #${i + 1}`,
      description: "How to plan your career path effectively...",
    })),
    "Templates": Array.from({ length: 22 }, (_, i) => ({
      title: `Template #${i + 1}`,
      description: "Downloadable templates for various purposes...",
    })),
    "AI tool": Array.from({ length: 17 }, (_, i) => ({
      title: `AI Tool #${i + 1}`,
      description: "Use AI to optimize your career path...",
    })),
    "Interview Preparation": Array.from({ length: 25 }, (_, i) => ({
      title: `Interview Prep #${i + 1}`,
      description: "Best practices for interview success...",
    })),
    "Company Profiles": Array.from({ length: 18 }, (_, i) => ({
      title: `Company Profile #${i + 1}`,
      description: "Detailed profiles of top companies...",
    })),
    "Skill Development Courses": Array.from({ length: 20 }, (_, i) => ({
      title: `Skill Course #${i + 1}`,
      description: "Courses to help you upskill efficiently...",
    })),
    "Psychological Tests": Array.from({ length: 16 }, (_, i) => ({
      title: `Psych Test #${i + 1}`,
      description: "Sample tests for self-assessment...",
    })),
  };

  const itemsPerPage = 15;
  const totalItems = resourcesData[selectedCategory]?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedResources = resourcesData[selectedCategory]?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setShowAll(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center pt-[80px]" style={{ backgroundImage: "url('/Curtin3.jpg')" }}>
      <div className="flex">
        {/* 左边分类栏 */}
        <aside className="w-48 bg-gray-800 text-white fixed top-[0px] left-0 h-screen z-40 flex flex-col pt-24 space-y-2">
          {categories.map((category) => (
            <div
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
                setShowAll(false);
              }}
              className={`text-lg font-light px-4 py-3 rounded-md transition cursor-pointer ${
                selectedCategory === category
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-800 hover:bg-yellow-300 hover:text-black"
              }`}
            >
              {category}
            </div>
          ))}
        </aside>

        {/* 右侧内容区域 */}
        <div className="ml-64 flex-1 pr-8 py-20 relative">
          {/* 搜索框 */}
          <div className="fixed top-30 right-8 left-64 max-w-[calc(100%-320px)] z-20">
            <div className="bg-white rounded-lg shadow-md p-6 flex space-x-4">
              <input
                type="text"
                placeholder="Search for resources..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 p-4 border rounded bg-gray-100 placeholder-gray-400 focus:placeholder-black text-black"
              />
              <button
                onClick={() => console.log("Searching for:", searchText)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded shadow"
              >
                Search
              </button>
            </div>
          </div>

          {/* 卡片内容 */}
          <main className="pt-25 space-y-2 w-full">
            {(showAll ? paginatedResources : paginatedResources.slice(0, 3)).map((resource, index) => (
              <ResourceCard
                key={index}
                resource={resource}
                index={index}
                scrollTop={scrollTop}
                lastIndex={paginatedResources.length - 1}
              />
            ))}
          </main>

          {/* Show More 按钮 */}
          {!showAll && paginatedResources.length > 3 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAll(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded shadow"
              >
                Show More
              </button>
            </div>
          )}

          {/* 页码翻页器 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => goToPage(1)}
                className="px-3 py-2 bg-gray-200 text-black rounded hover:bg-yellow-300"
              >
                First
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-200 text-black hover:bg-yellow-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(totalPages)}
                className="px-3 py-2 bg-gray-200 text-black rounded hover:bg-yellow-300"
              >
                Last
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


