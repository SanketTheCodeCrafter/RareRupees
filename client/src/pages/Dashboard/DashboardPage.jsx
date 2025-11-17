import { useAuth } from "../../context/AuthContext";
import { useCoins } from "../../context/CoinsContext";

import Filters from "../../components/dashboard/Filters";
import SearchBar from "../../components/dashboard/SearchBar";
import SortDropdown from "../../components/dashboard/SortDropdown";
import CoinGrid from "../../components/dashboard/CoinGrid";
import AddCoinButton from "../../components/dashboard/AddCoinButton";

export default function DashboardPage() {
  const { coins, loading } = useCoins();
  const { isAdmin } = useAuth();

  return (
    <div className="space-y-5">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SearchBar />
        <SortDropdown />
      </div>

      <Filters />

      {/* Grid */}
      <CoinGrid coins={coins} loading={loading} />

      {/* Admin Add Button */}
      {isAdmin && <AddCoinButton />}
    </div>
  );
}
