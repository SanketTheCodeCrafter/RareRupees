import { useState, useRef, useEffect } from "react";
import { FaSortAmountDown, FaCheck } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

const SORT_OPTIONS = [
  { label: "Newest First", value: "new" },
  { label: "Oldest First", value: "old" },
  { label: "Year (High to Low)", value: "year-desc" },
  { label: "Year (Low to High)", value: "year-asc" },
  { label: "Best Condition", value: "condition-desc" },
  { label: "Worst Condition", value: "condition-asc" },
];

export default function SortDropdown({ onSort }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(SORT_OPTIONS[0]);
  const dropdownRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    onSort?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative min-w-[200px]" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between pl-4 pr-3 py-3 rounded-2xl border text-sm font-medium transition-all duration-300
          ${isOpen
            ? "bg-gray-800 border-teal-500/50 text-white ring-2 ring-teal-500/20"
            : "bg-gray-800/50 border-white/10 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-white/20"
          }
        `}
      >
        <div className="flex items-center gap-3">
          <FaSortAmountDown className={`${isOpen ? "text-teal-400" : "text-gray-500"} transition-colors`} />
          <span>{selected.label}</span>
        </div>
        <IoChevronDown className={`text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-teal-400" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-full md:w-64 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50 animate-fade-in origin-top-right">
          <div className="p-1.5 space-y-0.5">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                  ${selected.value === option.value
                    ? "bg-teal-500/10 text-teal-400 font-medium"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }
                `}
              >
                <span>{option.label}</span>
                {selected.value === option.value && <FaCheck size={12} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
