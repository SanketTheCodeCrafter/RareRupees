// filename: src/components/dashboard/SearchBar.jsx
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <input
      type="text"
      className="w-full md:w-72 px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
      placeholder="Search coins..."
      value={query}
      onChange={handleChange}
    />
  );
}
