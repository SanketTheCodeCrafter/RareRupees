import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import DashboardPage from "./pages/Dashboard/DashboardPage";
import LoginPage from "./pages/Login/LoginPage";
import NotFound from "./pages/NotFound";
import "./index.css";
import { Toaster } from "react-hot-toast";

import Splash from "./components/Splash/Splash";

export default function App() {

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem("seenSplash");
    // Expire after 24 hours (like a session)
    const EXPIRY_TIME = 1 * 60 * 1000;

    if (seen) {
      try {
        const data = JSON.parse(seen);
        // Check if valid object with timestamp and not expired
        if (data && data.timestamp && (Date.now() - data.timestamp < EXPIRY_TIME)) {
          setShowSplash(false);
          return;
        }
      } catch (e) {
        // If parsing fails or legacy format, show splash again
      }
    }

    // auto-hide splash and set timestamp
    const t = setTimeout(() => {
      localStorage.setItem("seenSplash", JSON.stringify({ timestamp: Date.now() }));
      setShowSplash(false);
    }, 6000);
    return () => clearTimeout(t);
  }, []);


  if (showSplash) {
    return <Splash onFinish={() => {
      localStorage.setItem("seenSplash", JSON.stringify({ timestamp: Date.now() }));
      setShowSplash(false);
    }} />;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* Layout-wrapped pages */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>

          {/* Standalone pages */}
          <Route path="/login" element={<LoginPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '16px 24px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            maxWidth: '500px',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#1e293b',
            },
            style: {
              border: '1px solid rgba(74, 222, 128, 0.2)',
              background: 'rgba(30, 41, 59, 0.95)',
            }
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#1e293b',
            },
            style: {
              border: '1px solid rgba(248, 113, 113, 0.2)',
              background: 'rgba(30, 41, 59, 0.95)',
            }
          },
          loading: {
            style: {
              border: '1px solid rgba(96, 165, 250, 0.2)',
            }
          }
        }}
      />
    </>
  );
}
