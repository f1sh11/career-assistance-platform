"use client";

import { useState, useEffect } from "react";
import { Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [platformAlerts, setPlatformAlerts] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ✅ 初始化加载设置
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const settings = data.user?.notificationSettings;
        if (settings) {
          setEmailNotifications(settings.emailNotifications);
          setPlatformAlerts(settings.platformAlerts);
        }
      });
  }, []);

  // ✅ 保存按钮功能
  const handleSaveChanges = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return alert("Please log in");

    try {
      const res = await fetch(`${API_URL}/api/users/me/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          emailNotifications,
          platformAlerts
        })
      });

      if (!res.ok) throw new Error("Failed to save");
      alert("Settings saved successfully");
    } catch (err) {
      console.error(err);
      alert("Error saving settings");
    }
  };

  // ✅ Reset 按钮功能
  const handleReset = () => {
    setEmailNotifications(true);
    setPlatformAlerts(true);
  };

  const settings = [
    {
      group: "Notifications",
      items: [
        {
          title: "Email Notifications",
          subtitle: "Get email updates about your account.",
          icon: <Bell className="w-6 h-6 text-pink-500" />,
          control: (
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
              className="w-5 h-5 accent-pink-500"
            />
          )
        },
        {
          title: "Platform Alerts",
          subtitle: "Get system and security alerts.",
          icon: <Shield className="w-6 h-6 text-emerald-500" />,
          control: (
            <input
              type="checkbox"
              checked={platformAlerts}
              onChange={() => setPlatformAlerts(!platformAlerts)}
              className="w-5 h-5 accent-emerald-500"
            />
          )
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-24 px-4 sm:px-6 lg:px-8 text-gray-900 font-inter">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">⚙️ Settings</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage your preferences and alerts with ease.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <aside className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow p-4 space-y-2 border border-gray-100">
              <button className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-50 transition">Notifications</button>
              <button className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-50 transition">Security</button>
            </div>
          </aside>

          <main className="md:col-span-3 space-y-10">
            {settings.map((group, idx) => (
              <section key={idx}>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">{group.group}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.items.map((setting, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition transform hover:-translate-y-[2px] flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div>{setting.icon}</div>
                        <div>
                          <h3 className="font-semibold text-base text-gray-800">{setting.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 leading-snug">{setting.subtitle}</p>
                        </div>
                      </div>
                      <div className="pt-1">{setting.control}</div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <div className="pt-8 flex justify-end gap-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Reset
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Save Changes
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
