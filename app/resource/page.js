"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function ResourceCard({ resource, index, scrollTop, lastIndex, role, currentUserId, handleDelete }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);
  const [showFull, setShowFull] = useState(false);

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

  const renderDescription = () => {
    const lines = resource.description.split('\n');
    const fullText = lines.map((line, idx) => <p key={idx}>{line}</p>);

    if (resource.description.length <= 60 || showFull) {
      return (
        <div className="text-gray-700 space-y-2">
          {fullText}
          {resource.description.length > 60 && (
            <button
              onClick={() => setShowFull(false)}
              className="text-blue-500 underline text-sm"
            >
              Hide
            </button>
          )}
        </div>
      );
    }

    const preview = resource.description.slice(0, 60) + '...';

    return (
      <div className="text-gray-700 space-y-2">
        <p>{preview}</p>
        <button
          onClick={() => setShowFull(true)}
          className="text-blue-500 underline text-sm"
        >
          Show
        </button>
      </div>
    );
  };

  return (
    <div
      ref={ref}
      className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <h2 className="text-2xl font-semibold mb-4 text-black">{resource.title}</h2>
      {renderDescription()}
      {(role === "admin" || resource.uploader === currentUserId) && (
        <button
          onClick={() => handleDelete(resource._id)}
          className="text-red-500 mt-2 underline text-sm hover:text-red-700"
        >
          Delete
        </button>
      )}
    </div>
  );
}


export default function ResourcePage() {
  const [category, setCategory] = useState("Career Guides");
  const [resources, setResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [role, setRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const router = useRouter();

  const itemsPerPage = 15;
  const categories = [
    "Career Guides",
    "Templates",
    "AI tool",
    "Interview Preparation",
    "Company Profiles",
    "Skill Development Courses",
    "Mbti Tests"
  ];

  const fetchResources = async () => {
    try {
      const res = await axios.get(
        `${API}/api/resources?category=${encodeURIComponent(category)}&page=${currentPage}&limit=${itemsPerPage}&search=${searchText}`
      );
      setResources(res.data.resources);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch resources", err);
    }
  };

  const fetchRole = () => {
    try {
      const userStr = sessionStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);
      setRole(user.role);
      setCurrentUserId(user._id || user.id || "");
    } catch (err) {
      console.error("Failed to parse role");
    }
  };

  const handleDelete = async (id) => {
    const token = sessionStorage.getItem("token");
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      await axios.delete(`${API}/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete resource", err);
      alert("Failed to delete resource");
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  useEffect(() => {
    fetchResources();
  }, [category, currentPage, searchText]);

  useEffect(() => {
    const handleScroll = () => setScrollTop(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setShowAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center pt-[80px]" style={{ backgroundImage: "url('/Curtin3.jpg')" }}>
      <div className="flex">
        {/* 分类侧栏 */}
        <aside className="w-48 bg-gray-800 text-white fixed top-[0px] left-0 h-screen z-40 flex flex-col pt-24 space-y-2">
          {categories.map((cat) => (
            <div
              key={cat}
              onClick={() => {
                if (cat === "Mbti Tests") {
                  router.push("/resource/mbti"); // ✅ 跳转到 MBTI 页面
                } else {
                  setCategory(cat);
                  setCurrentPage(1);
                  setShowAll(false);
                }
              }}
              className={`text-lg font-light px-4 py-3 rounded-md transition cursor-pointer ${
                category === cat ? "bg-yellow-400 text-black" : "bg-gray-800 hover:bg-yellow-300 hover:text-black"
              }`}
            >
              {cat}
            </div>
          ))}
        </aside>


        {/* 内容主区域 */}
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
                onClick={() => fetchResources()}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded shadow"
              >
                Search
              </button>
            </div>
          </div>

          {/* 上传按钮 */}
          {(role === "mentor" || role === "industry" || role === "admin") && (
            <div className="fixed bottom-10 right-10 z-50">
              <button
                onClick={() => router.push("/resource/upload")}
                className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600"
              >
                Upload Resource
              </button>
            </div>
          )}

          {/* 资源卡片列表 */}
          <main className="pt-24 space-y-4">
            {(showAll ? resources : resources?.slice(0, 3)).map((res, index) => (
              <ResourceCard
                key={res._id || index}
                resource={res}
                scrollTop={scrollTop}
                index={index}
                lastIndex={resources.length - 1}
                role={role}
                currentUserId={currentUserId}
                handleDelete={handleDelete}
              />
            ))}
          </main>

          {/* Show More */}
          {!showAll && resources?.length > 3 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAll(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded shadow"
              >
                Show More
              </button>
            </div>
          )}

          {/* 分页器 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button onClick={() => goToPage(1)} className="px-3 py-2 bg-gray-200 text-black rounded hover:bg-yellow-300">
                First
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1 ? "bg-yellow-400 text-black" : "bg-gray-200 text-black hover:bg-yellow-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => goToPage(totalPages)} className="px-3 py-2 bg-gray-200 text-black rounded hover:bg-yellow-300">
                Last
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
