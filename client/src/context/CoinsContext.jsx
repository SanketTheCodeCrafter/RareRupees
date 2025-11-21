// filename: src/context/CoinsContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  fetchCoinsAPI,
  fetchCoinAPI,
  createCoinAPI,
  updateCoinAPI,
  deleteCoinAPI,
} from "../api/coin.api";

import toast from "react-hot-toast";

const CoinsContext = createContext();

export const CoinsProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCoin, setActiveCoin] = useState(null);
  const [error, setError] = useState(null);

  // Load all coins
  const loadCoins = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCoinsAPI();
      setCoins(res);
    } catch (err) {
      console.error("Error loading coins:", err);
      toast.error(err.response?.data?.message || "Failed to load coins");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoins();
  }, [loadCoins]);

  // Fetch a single coin
  const getCoin = async (id) => {
    try {
      const coin = await fetchCoinAPI(id);
      setActiveCoin(coin);
      return coin;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch coin");
    }
  };

  // CREATE coin
  const createCoin = async (payload) => {
    try {
      setLoading(true);

      const formData = new FormData();

      if (payload.frontImage instanceof File) {
        formData.append("frontImage", payload.frontImage);
      }
      if (payload.rearImage instanceof File) {
        formData.append("rearImage", payload.rearImage);
      }

      if (payload.denomination !== undefined)
        formData.append("denomination", payload.denomination);
      if (payload.year !== undefined)
        formData.append("year", payload.year);
      if (payload.mint !== undefined)
        formData.append("mint", payload.mint);
      if (payload.condition !== undefined)
        formData.append("condition", payload.condition);
      if (payload.mark !== undefined)
        formData.append("mark", payload.mark);
      if (payload.isSpecial !== undefined)
        formData.append("isSpecial", payload.isSpecial);

      const res = await createCoinAPI(formData);

      // IMPORTANT FIX: support different response shapes from the API
      const success =
        (res && res.data && typeof res.data.success !== "undefined" && res.data.success) ||
        (res && typeof res.success !== "undefined" && res.success) ||
        (res && typeof res.status === "number" && res.status >= 200 && res.status < 300);

      const respData = (res && res.data && res.data.data) || (res && res.data) || res;
      const message = (res && res.data && res.data.message) || (res && res.message);

      if (success) {
        const coin = respData;
        setCoins((prev) => [coin, ...prev]);
        toast.success(message || "Coin created");
        return { success: true, coin };
      }

      // Fallback: if API returned created object without a success flag, treat as success if it has an id
      if (respData && (respData._id || respData.id)) {
        const coin = respData;
        setCoins((prev) => [coin, ...prev]);
        toast.success(message || "Coin created");
        return { success: true, coin };
      }

      toast.error(message || "Create failed");
      return { success: false };

    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Create failed";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // UPDATE coin
  const updateCoin = async (id, payload) => {
    try {
      setLoading(true);

      const formData = new FormData();

      if (payload.frontImage instanceof File)
        formData.append("frontImage", payload.frontImage);
      if (payload.rearImage instanceof File)
        formData.append("rearImage", payload.rearImage);

      if (payload.denomination !== undefined)
        formData.append("denomination", payload.denomination);
      if (payload.year !== undefined)
        formData.append("year", payload.year);
      if (payload.mint !== undefined)
        formData.append("mint", payload.mint);
      if (payload.condition !== undefined)
        formData.append("condition", payload.condition);
      if (payload.mark !== undefined)
        formData.append("mark", payload.mark);
      if (payload.isSpecial !== undefined)
        formData.append("isSpecial", payload.isSpecial);

      const res = await updateCoinAPI(id, formData);

      // IMPORTANT FIX: support different response shapes from the API
      const success =
        (res && res.data && typeof res.data.success !== "undefined" && res.data.success) ||
        (res && typeof res.success !== "undefined" && res.success) ||
        (res && typeof res.status === "number" && res.status >= 200 && res.status < 300);

      const respData = (res && res.data && res.data.data) || (res && res.data) || res;
      const message = (res && res.data && res.data.message) || (res && res.message);

      if (success) {
        const updatedCoin = respData;

        setCoins((prev) =>
          prev.map((c) => (c._id === id ? updatedCoin : c))
        );

        toast.success(message || "Coin updated");

        return { success: true, coin: updatedCoin };
      }

      // Fallback: if API returned updated object without a success flag, treat as success if it has an id
      if (respData && (respData._id || respData.id)) {
        const updatedCoin = respData;

        setCoins((prev) =>
          prev.map((c) => (c._id === id ? updatedCoin : c))
        );

        toast.success(message || "Coin updated");

        return { success: true, coin: updatedCoin };
      }

      toast.error(message || "Update failed");
      return { success: false };

    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Update failed";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // DELETE coin
  const deleteCoin = async (id) => {
    try {
      setLoading(true);

      const res = await deleteCoinAPI(id);

      // support different response shapes from the API (data.success, top-level success, HTTP 2xx, deletedCount, deleted id fields)
      const success =
        (res && res.data && typeof res.data.success !== "undefined" && res.data.success) ||
        (res && typeof res.success !== "undefined" && res.success) ||
        (res && typeof res.status === "number" && res.status >= 200 && res.status < 300) ||
        (res && res.data && ((res.data.deletedCount && res.data.deletedCount > 0) || (res.data.data && res.data.data.deletedCount && res.data.data.deletedCount > 0))) ||
        (res && res.data && (res.data._id || res.data.id || res.data.deletedId));

      const message = (res && res.data && res.data.message) || (res && res.message);

      if (success) {
        // remove by either _id or id to cover different object shapes
        setCoins((prev) => prev.filter((c) => c._id !== id && c.id !== id));
        toast.success(message || "Coin deleted");
        return { success: true };
      }

      toast.error(message || "Delete failed");
      return { success: false };

    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Delete failed";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoinsContext.Provider
      value={{
        coins,
        loading,
        activeCoin,
        error,
        loadCoins,
        getCoin,
        createCoin,
        updateCoin,
        deleteCoin,
      }}
    >
      {children}
    </CoinsContext.Provider>
  );
};

export const useCoins = () => useContext(CoinsContext);
