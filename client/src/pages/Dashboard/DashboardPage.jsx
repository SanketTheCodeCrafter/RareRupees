import { useState, useMemo } from "react";

import Filters from "../../components/dashboard/Filters";
import SortDropdown from "../../components/dashboard/SortDropdown";
import CoinGrid from "../../components/dashboard/CoinGrid";
import SearchBar from "../../components/dashboard/SearchBar";

import CoinDetailModal from "../../components/modal/CoinDetailModal";
import CoinModal from "../../components/modal/CoinModal";

import AddCoinButton from "../../components/dashboard/AddCoinButton";

import { useCoins } from "../../context/CoinsContext";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { coins = [], loading, deleteCoin } = useCoins();
  const { isAdmin } = useAuth();

  // SELECTED COIN FOR VIEWING (DETAIL)
  const [detailCoin, setDetailCoin] = useState(null);

  // SELECTED COIN FOR EDITING/CREATING
  const [modalState, setModalState] = useState(null);

  // FILTER
  const [activeFilter, setActiveFilter] = useState("All");

  // SORT
  const [sortType, setSortType] = useState("new");

  // SEARCH
  const [searchQuery, setSearchQuery] = useState("");

  // DELETE CONFIRM
  const [deleteTarget, setDeleteTarget] = useState(null);

  // FILTER + SORT LOGIC
  const { filteredCoins, counts } = useMemo(() => {
    const counts = { All: coins.length, Special: 0 };

    // Calculate counts
    coins.forEach(c => {
      if (c.isSpecial) counts.Special = (counts.Special || 0) + 1;
      const d = String(c.denomination).trim();
      counts[d] = (counts[d] || 0) + 1;
    });

    if (!coins.length) return { filteredCoins: [], counts };

    let list = [...coins];

    // SEARCH
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) =>
        String(c.year).includes(q) ||
        String(c.mark).toLowerCase().includes(q) ||
        String(c.denomination).toLowerCase().includes(q) ||
        String(c.mint).toLowerCase().includes(q)
      );
    }

    // FILTER
    if (activeFilter !== "All") {
      if (activeFilter === "Special") {
        list = list.filter((c) => c.isSpecial);
      } else {
        list = list.filter((c) => String(c.denomination).trim() == String(activeFilter));
      }
    }

    // SORT
    if (sortType === "new") list.sort((a, b) => b.year - a.year);
    if (sortType === "old") list.sort((a, b) => a.year - b.year);
    if (sortType === "year-asc") list.sort((a, b) => a.year - b.year);
    if (sortType === "year-desc") list.sort((a, b) => b.year - a.year);
    if (sortType === "condition-desc") list.sort((a, b) => b.condition - a.condition);
    if (sortType === "condition-asc") list.sort((a, b) => a.condition - b.condition);

    return { filteredCoins: list, counts };
  }, [coins, activeFilter, sortType, searchQuery]);

  // DELETE CONFIRMATION HANDLER
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteCoin(deleteTarget._id);
    if (res.success) {
      // toast is already handled in context, but we can add specific UI feedback if needed
      // or just close the modal
    }
    setDeleteTarget(null);
  };

  return (
    <>
      {/* TOP BAR → Search & Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-6 gap-4">
        <SearchBar onSearch={setSearchQuery} />
        <SortDropdown onSort={setSortType} />
      </div>

      {/* FILTERS */}
      <Filters active={activeFilter} onChange={setActiveFilter} counts={counts} />

      {/* RESULTS HEADER */}
      <div className="flex items-center justify-between mt-8 mb-4 px-1">
        <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-teal-500 rounded-full"></span>
          {filteredCoins.length} {filteredCoins.length === 1 ? 'Coin' : 'Coins'} Found
        </h2>
      </div>

      {/* COIN GRID */}
      <CoinGrid
        coins={filteredCoins}
        loading={loading}
        onSelect={(coin) => setDetailCoin(coin)}            // VIEW DETAILS
        onEdit={(coin) =>
          setModalState({ mode: "edit", initial: coin })    // EDIT
        }
        onDelete={(coin) => setDeleteTarget(coin)}          // DELETE CONFIRM
      />

      {/* DETAIL MODAL (VIEW-ONLY) */}
      {detailCoin && (
        <CoinDetailModal
          coin={detailCoin}
          onClose={() => setDetailCoin(null)}
        />
      )}

      {/* ADD/EDIT MODAL */}
      {modalState && (
        <CoinModal
          mode={modalState.mode}
          initial={modalState.initial}
          onClose={() => setModalState(null)}
        />
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl w-full max-w-sm text-white">
            <h2 className="text-lg font-bold mb-4">Delete Coin</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this coin?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD BUTTON (ADMIN ONLY) */}
      {isAdmin && (
        <AddCoinButton
          onClick={() =>
            setModalState({ mode: "create", initial: null })
          }
        />
      )}
    </>
  );
}
