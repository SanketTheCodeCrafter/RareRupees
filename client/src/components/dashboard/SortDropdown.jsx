// filename: src/components/dashboard/SortDropdown.jsx
export default function SortDropdown({ onSort }) {
  return (
    <select
      className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
      onChange={(e) => onSort?.(e.target.value)}
    >
      <option value="new">Newest</option>
      <option value="old">Oldest</option>
      <option value="year-asc">Year ↑</option>
      <option value="year-desc">Year ↓</option>
      <option value="condition-desc">Condition ↓</option>
      <option value="condition-asc">Condition ↑</option>
    </select>
  );
}
