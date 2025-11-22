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
      {/* DASHBOARD HEADER */}
      <div className="flex flex-col gap-6 mt-8 mb-10">

        {/* Top Row: Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="flex-1 max-w-2xl">
            <SearchBar onSearch={setSearchQuery} />
          </div>
          <div className="flex items-center justify-between md:justify-end gap-4">
            <div className="text-sm text-gray-400 font-medium whitespace-nowrap hidden md:block">
              Sort by:
            </div>
            <SortDropdown onSort={setSortType} />
          </div>
        </div>

        {/* Bottom Row: Filters & Results Count */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-white/5 pb-6">
          <div className="w-full md:w-auto overflow-hidden">
            <Filters active={activeFilter} onChange={setActiveFilter} counts={counts} />
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">
              {filteredCoins.length} {filteredCoins.length === 1 ? 'Coin' : 'Coins'} Found
            </span>
          </div>
        </div>

        {/* Mobile Only Results Count (below filters) */}
        <div className="md:hidden flex items-center justify-between px-1">
          <span className="text-sm font-medium text-gray-400">
            Showing results
          </span>
          <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-full">
            {filteredCoins.length} Coins
          </span>
        </div>
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
