import { FaCoins, FaStar, FaLayerGroup } from "react-icons/fa";

const FILTERS = [
  { label: "All Coins", value: "All", icon: FaLayerGroup },
  { label: "₹1", value: "1" },
  { label: "₹2", value: "2" },
  { label: "₹5", value: "5" },
  { label: "₹10", value: "10" },
  { label: "₹20", value: "20" },
  { label: "₹0.25", value: "0.25" },
  { label: "₹0.50", value: "0.50" },
  { label: "Special", value: "Special", icon: FaStar },
];

export default function Filters({ active, onChange, counts = {} }) {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
      <div className="flex gap-3 px-1 min-w-max">
        {FILTERS.map((f) => {
          const isActive = f.value === active;
          const count = counts[f.value] || 0;
          const Icon = f.icon || FaCoins;

          return (
            <button
              key={f.value}
              onClick={() => onChange(f.value)}
              className={`
                group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                ${isActive
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/25 scale-105 ring-1 ring-white/20"
                  : "bg-gray-800/40 text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-white/5 hover:border-white/10"
                }
              `}
            >
              <Icon className={`transition-colors ${isActive ? "text-white" : "text-gray-500 group-hover:text-teal-400"}`} size={14} />
              <span>{f.label}</span>

              {/* Count Badge */}
              <span className={`
                ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors
                ${isActive
                  ? "bg-white/20 text-white"
                  : "bg-gray-700/50 text-gray-500 group-hover:bg-gray-700 group-hover:text-gray-300"
                }
              `}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
