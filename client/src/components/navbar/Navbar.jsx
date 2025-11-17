import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center bg-black/20 backdrop-blur-xl border-b border-white/10">
      <Link to="/" className="font-bold text-xl tracking-wide">
        RareRupees
      </Link>

      {isAdmin ? (
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600"
        >
          Logout
        </button>
      ) : (
        <Link
          to="/login"
          className="px-4 py-2 text-sm rounded-lg bg-teal-400 text-black font-semibold hover:bg-teal-300"
        >
          Login
        </Link>
      )}
    </nav>
  );
}
