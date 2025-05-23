"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AutoLogout() {
  const [warningVisible, setWarningVisible] = useState(false);
  const [logoutTimerId, setLogoutTimerId] = useState(null);
  const [inactivityTimerId, setInactivityTimerId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const startTimers = () => {
      clearTimeout(inactivityTimerId);
      clearTimeout(logoutTimerId);

      // 15分钟无操作后显示弹窗
      const inactivityTimer = setTimeout(() => {
        setWarningVisible(true);

        // 5分钟后无点击则自动登出
        const logoutTimer = setTimeout(() => {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          router.push("/login");
        }, 5 * 60 * 1000);

        setLogoutTimerId(logoutTimer);
      }, 15 * 60 * 1000);

      setInactivityTimerId(inactivityTimer);
    };

    const reset = () => {
      startTimers();
      setWarningVisible(false);
    };

    // 初始计时器
    startTimers();

    // 监听用户操作
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    window.addEventListener("click", reset);

    return () => {
      clearTimeout(inactivityTimerId);
      clearTimeout(logoutTimerId);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("click", reset);
    };
  }, []);

  const continueSession = () => {
    setWarningVisible(false);
    clearTimeout(logoutTimerId);
  };

  const forceLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
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
