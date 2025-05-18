"use client";

import { useEffect } from "react";

export default function AutoLogout() {
  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // 如果你有缓存 user 也一并清理
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return null;
}
