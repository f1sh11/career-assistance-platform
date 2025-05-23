"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AutoLogout() {
  const [warningVisible, setWarningVisible] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false); // ✅ 用于锁住 reset
  const router = useRouter();

  useEffect(() => {
    let inactivityTimerId;
    let logoutTimerId;

    const resetTimers = () => {
      if (isPrompting) return; // ✅ 提示中不重置

      clearTimeout(inactivityTimerId);
      clearTimeout(logoutTimerId);
      setWarningVisible(false);

      // ⏱️ 15分钟无操作 → 显示提示框
      inactivityTimerId = setTimeout(() => {
        setWarningVisible(true);
        setIsPrompting(true);

        // ⏱️ 提示框出现后 5分钟不操作 → 自动登出
        logoutTimerId = setTimeout(() => {
          sessionStorage.clear();
          router.push("/login");
        }, 5 * 60 * 1000);
      }, 30 * 60 * 1000);
    };

    // ✅ 绑定事件监听
    window.addEventListener("mousemove", resetTimers);
    window.addEventListener("keydown", resetTimers);
    window.addEventListener("click", resetTimers);
    resetTimers();

    return () => {
      clearTimeout(inactivityTimerId);
      clearTimeout(logoutTimerId);
      window.removeEventListener("mousemove", resetTimers);
      window.removeEventListener("keydown", resetTimers);
      window.removeEventListener("click", resetTimers);
    };
  }, [isPrompting]);

  const continueSession = () => {
    setIsPrompting(false);
    setWarningVisible(false);
  };

  const forceLogout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  if (!warningVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center space-y-4">
        <h2 className="text-lg font-bold">Session Timeout</h2>
        <p className="text-sm text-gray-700">You've been inactive. Continue using this session?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={continueSession}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Yes
          </button>
          <button
            onClick={forceLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
