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
    <div className="relative w-full md:w-96 group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-500 group-focus-within:text-teal-400 transition-colors" />
      </div>
      <input
        type="text"
        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-gray-800 transition-all shadow-sm hover:bg-gray-800"
        placeholder="Search by year, mark, or denomination..."
        value={query}
        onChange={handleChange}
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
}
