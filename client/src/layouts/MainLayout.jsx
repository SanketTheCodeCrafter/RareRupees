import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <Navbar />
      <main className="px-4 md:px-8 pt-4">
        <Outlet />
      </main>
    </div>
  );
}
