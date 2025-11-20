import { useState, useMemo } from "react";

import Filters from "../../components/dashboard/Filters";
import SortDropdown from "../../components/dashboard/SortDropdown";
import CoinGrid from "../../components/dashboard/CoinGrid";

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

  // DELETE CONFIRM
  const [deleteTarget, setDeleteTarget] = useState(null);

  // FILTER + SORT LOGIC
  const filteredCoins = useMemo(() => {
    if (!coins.length) return [];

    let list = [...coins];

    // FILTER
    if (activeFilter !== "All") {
      if (activeFilter === "Special") {
        list = list.filter((c) => c.isSpecial);
      } else {
        list = list.filter((c) => c.denomination === activeFilter);
      }
    }

    // SORT
    if (sortType === "new") list.sort((a, b) => b.year - a.year);
    if (sortType === "old") list.sort((a, b) => a.year - b.year);
    if (sortType === "year-asc") list.sort((a, b) => a.year - b.year);
    if (sortType === "year-desc") list.sort((a, b) => b.year - a.year);
    if (sortType === "condition-desc") list.sort((a, b) => b.condition - a.condition);
    if (sortType === "condition-asc") list.sort((a, b) => a.condition - b.condition);

    return list;
  }, [coins, activeFilter, sortType]);

  // DELETE CONFIRMATION HANDLER
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteCoin(deleteTarget._id);
    setDeleteTarget(null);
  };

  return (
    <>
      {/* TOP BAR → Sorting */}
      <div className="flex justify-end items-center mt-4 mb-4">
        <SortDropdown onSort={setSortType} />
      </div>

      {/* FILTERS */}
      <Filters active={activeFilter} onChange={setActiveFilter} />

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
