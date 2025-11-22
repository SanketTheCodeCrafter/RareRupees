// filename: src/components/dashboard/SortDropdown.jsx
import { FaSortAmountDown } from "react-icons/fa";

export default function SortDropdown({ onSort }) {
  return (
    <div className="relative group min-w-[200px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSortAmountDown className="text-gray-500 group-hover:text-teal-400 transition-colors" />
      </div>
      <select
        className="appearance-none w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white 
                   focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 
                   hover:bg-gray-800 cursor-pointer transition-all shadow-sm"
        onChange={(e) => onSort?.(e.target.value)}
      >
        <option value="new">Newest First</option>
        <option value="old">Oldest First</option>
        <option value="year-desc">Year (High to Low)</option>
        <option value="year-asc">Year (Low to High)</option>
        <option value="condition-desc">Best Condition</option>
        <option value="condition-asc">Worst Condition</option>
      </select>
      {/* Custom Arrow */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-gray-500 group-hover:text-teal-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
