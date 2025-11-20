// filename: src/components/dashboard/CoinCard.jsx
import { useAuth } from "../../context/AuthContext";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function CoinCard({ coin, onSelect, onEdit, onDelete }) {
  const { isAdmin } = useAuth();

  const handleCardClick = () => {
    if (onSelect) onSelect(coin);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-[#0d1117] rounded-xl p-4 border border-gray-700 
                 shadow hover:shadow-lg transition cursor-pointer"
    >
      {/* FRONT IMAGE ONLY */}
      <img
        src={coin.frontImage}
        alt="Front"
        className="w-full h-48 object-cover rounded-lg border border-gray-700"
      />

      {/* BASIC INFO */}
      <div className="mt-3">
        <h3 className="text-lg font-semibold text-white">
          {coin.denomination} — {coin.year}
        </h3>
        <p className="text-gray-400 text-sm">Mint: {coin.mint}</p>
        <p className="text-gray-400 text-sm">Mark: {coin.mark}</p>
      </div>

      {/* ADMIN BUTTONS */}
      {isAdmin && (
        <div
          className="absolute top-3 right-3 flex gap-2"
          onClick={(e) => e.stopPropagation()} // IMPORTANT: stop modal open
        >
          {/* EDIT */}
          <button
            className="p-2 rounded-lg bg-teal-400 text-black hover:bg-teal-300 transition"
            onClick={() => onEdit?.(coin)}
          >
            <FiEdit2 size={18} />
          </button>

          {/* DELETE */}
          <button
            className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-400 transition"
            onClick={() => onDelete?.(coin)}
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
