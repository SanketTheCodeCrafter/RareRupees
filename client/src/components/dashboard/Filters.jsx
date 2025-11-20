import { useState } from "react";
import { FaCoins } from "react-icons/fa";

const FILTERS = [
  { label: "All", value: "All" },
  { label: "₹1", value: "1" },
  { label: "₹2", value: "2" },
  { label: "₹5", value: "5" },
  { label: "₹10", value: "10" },
  { label: "₹20", value: "20" },
  { label: "₹0.25", value: "0.25" },
  { label: "₹0.50", value: "0.50" },
  { label: "Special", value: "Special" },
];

export default function Filters({ active, onChange }) {
  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      {FILTERS.map((f) => {
        const isActive = f.value === active;
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all 
                ${isActive 
                  ? "bg-teal-400 text-black border-teal-400" 
                  : "text-gray-300 border-gray-700 hover:bg-gray-800"
                }
            `}
          >
            <FaCoins size={14} />
            <span>{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}
