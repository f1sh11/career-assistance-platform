// pages/test/index.tsx
import { useEffect } from "react";
import MainLayout from "../../components/layouts/main-layout";
import TestDisplay from "../../components/test/test-display";

export default function TestPage() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      console.log("✅ token saved to localStorage:", token);
    } else {
      console.warn("❌ No token found in URL");
    }
  }, []);

  return (
    <MainLayout>
      <TestDisplay />
    </MainLayout>
  );
}