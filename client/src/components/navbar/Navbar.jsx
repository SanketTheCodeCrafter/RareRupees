import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FaGem } from "react-icons/fa";
import { useState } from "react";

export default function Navbar() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-[#05070a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/20 group-hover:border-teal-500/40 transition-all duration-300">
              <FaGem className="text-teal-400 text-lg group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:from-teal-400 group-hover:to-emerald-400 transition-all duration-300">
              RareRupees
            </span>
          </Link>

          {/* Login/Logout */}
          {isAdmin ? (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="px-5 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 text-sm font-medium transition-all duration-300 backdrop-blur-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 rounded-full bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 hover:border-teal-500/40 text-sm font-medium transition-all duration-300 backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(45,212,191,0.1)] hover:shadow-[0_0_20px_-3px_rgba(45,212,191,0.2)]"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl transform transition-all scale-100">
            <h3 className="text-xl font-bold text-white mb-2">Confirm Logout</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to log out of your account?</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors shadow-lg shadow-red-500/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
