import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import DashboardPage from "./pages/Dashboard/DashboardPage";
import LoginPage from "./pages/Login/LoginPage";
import NotFound from "./pages/NotFound";
import "./index.css";
import { Toaster } from "react-hot-toast";

export default function App() {
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
        toastOptions={{
          style: {
            background: "#111827",
            color: "white",
            border: "1px solid #374151",
          },
        }}
      />
    </>
  );
}

