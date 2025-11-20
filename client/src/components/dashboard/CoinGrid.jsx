// filename: src/components/dashboard/CoinGrid.jsx
import CoinCard from "./CoinCard";

export default function CoinGrid({ coins, loading, onSelect, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="text-gray-400 text-center py-10">
        Loading coins...
      </div>
    );
  }

  if (!coins?.length) {
    return (
      <div className="text-gray-500 text-center py-10">
        No coins found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {coins.map((coin) => (
        <CoinCard
          key={coin._id}
          coin={coin}

          // Open detail modal
          onSelect={() => onSelect(coin)}

          // Admin Edit
          onEdit={() => onEdit(coin)}

          // Admin Delete
          onDelete={() => onDelete(coin)}
        />
      ))}
    </div>
  );
}
