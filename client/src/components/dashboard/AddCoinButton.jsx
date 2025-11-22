// filename: src/components/dashboard/AddCoinButton.jsx
import { useAuth } from "../../context/AuthContext";
import { FaPlus } from "react-icons/fa";

export default function AddCoinButton({ onClick }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 text-black
                 shadow-lg shadow-teal-500/40 hover:shadow-teal-500/60 hover:scale-110 transition-all duration-300
                 flex items-center justify-center z-40 group"
      title="Add New Coin"
    >
      <FaPlus className="text-xl group-hover:rotate-90 transition-transform duration-300" />
    </button>
  );
}
