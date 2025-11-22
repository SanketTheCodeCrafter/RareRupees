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
      className="group relative bg-gray-900/60 backdrop-blur-md rounded-2xl p-3 border border-white/10 
                 hover:border-teal-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-900/20 
                 hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      {/* IMAGES GRID */}
      <div className="grid grid-cols-2 gap-2 mb-4 relative">
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-800 border border-white/5">
          <img
            src={coin.frontImage}
            alt="Front"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-800 border border-white/5">
          <img
            src={coin.rearImage || coin.frontImage}
            alt="Back"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* INFO */}
      <div className="space-y-1 px-1">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
            {coin.isSpecial ? coin.denomination : (coin.denomination.toString().startsWith('₹') ? coin.denomination : `₹${coin.denomination}`)}
          </h3>
          <span className="text-lg font-medium text-gray-300">
            {coin.year}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 text-sm text-gray-400">
          <p>Mint: <span className="text-gray-300">{coin.mint}</span></p>
          <p className="truncate" title={coin.mark}>
            Mark: <span className="text-gray-300">{coin.mark}</span>
          </p>
        </div>
      </div>

      {/* ADMIN BUTTONS */}
      {isAdmin && (
        <div
          className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="p-2 rounded-lg bg-gray-800/80 text-teal-400 hover:bg-teal-500 hover:text-white border border-white/10 backdrop-blur-sm transition-all"
            onClick={() => onEdit?.(coin)}
            title="Edit Coin"
          >
            <FiEdit2 size={16} />
          </button>

          <button
            className="p-2 rounded-lg bg-gray-800/80 text-red-400 hover:bg-red-500 hover:text-white border border-white/10 backdrop-blur-sm transition-all"
            onClick={() => onDelete?.(coin)}
            title="Delete Coin"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
