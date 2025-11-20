import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../dashboard/SearchBar";

export default function Navbar() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-black/30 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center gap-6">
      
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-white">
        RareRupees
      </Link>

      {/* Center Search */}
      <div className="flex-1 max-w-xl mx-auto">
        <SearchBar />
      </div>

      {/* Login/Logout */}
      {isAdmin ? (
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-sm text-white"
        >
          Logout
        </button>
      ) : (
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg bg-teal-400 text-black hover:bg-teal-300 text-sm"
        >
          Login
        </Link>
      )}
    </nav>
  );
}
