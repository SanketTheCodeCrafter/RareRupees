import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch?.(val);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch?.("");
  };

  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <FaSearch className="text-gray-500 group-focus-within:text-teal-400 transition-colors duration-300" />
      </div>
      <input
        type="text"
        className="w-full pl-11 pr-11 py-3 rounded-2xl bg-gray-800/50 border border-white/10 text-white placeholder-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 focus:bg-gray-800 
                   hover:bg-gray-800/80 transition-all duration-300 shadow-lg shadow-black/20 backdrop-blur-sm"
        placeholder="Search by year, mark, or denomination..."
        value={query}
        onChange={handleChange}
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors z-10"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
}
