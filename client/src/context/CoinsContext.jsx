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

const CoinsContext = createContext();

export const CoinsProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCoin, setActiveCoin] = useState(null);
  const [error, setError] = useState(null);

  // Initial fetch
  const loadCoins = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCoinsAPI();
      setCoins(data);
    } catch (err) {
      console.error("Error loading coins:", err);
      setError("Failed to load coins");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoins();
  }, [loadCoins]);

  // GET one coin
  const getCoin = async (id) => {
    try {
      const coin = await fetchCoinAPI(id);
      setActiveCoin(coin);
      return coin;
    } catch (err) {
      console.error("Fetch coin error:", err);
      setError("Failed to fetch coin");
    }
  };

  // CREATE coin with dual image upload
  const createCoin = async (payload) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Append images
      formData.append("frontImage", payload.frontImage);
      formData.append("rearImage", payload.rearImage);

      // Append all fields
      formData.append("denomination", payload.denomination);
      formData.append("year", payload.year);
      formData.append("mint", payload.mint);
      formData.append("condition", payload.condition);
      formData.append("mark", payload.mark);
      formData.append("isSpecial", payload.isSpecial);

      const createdCoin = await createCoinAPI(formData);

      // Optimistic update OR reload
      setCoins((prev) => [createdCoin, ...prev]);

      return { success: true, coin: createdCoin };
    } catch (err) {
      console.error("Create coin error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create coin",
      };
    } finally {
      setLoading(false);
    }
  };

  // UPDATE coin with optional new images
  const updateCoin = async (id, payload) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Only append image fields if user selected new images
      if (payload.frontImage instanceof File) {
        formData.append("frontImage", payload.frontImage);
      }
      if (payload.rearImage instanceof File) {
        formData.append("rearImage", payload.rearImage);
      }

      // Append updated fields
      formData.append("denomination", payload.denomination);
      formData.append("year", payload.year);
      formData.append("mint", payload.mint);
      formData.append("condition", payload.condition);
      formData.append("mark", payload.mark);
      formData.append("isSpecial", payload.isSpecial);

      const updatedCoin = await updateCoinAPI(id, formData);

      // Replace in local state
      setCoins((prev) =>
        prev.map((c) => (c._id === id ? updatedCoin : c))
      );

      return { success: true, coin: updatedCoin };
    } catch (err) {
      console.error("Update coin error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update coin",
      };
    } finally {
      setLoading(false);
    }
  };

  // DELETE coin
  const deleteCoin = async (id) => {
    try {
      setLoading(true);
      await deleteCoinAPI(id);

      // Optimistic removal
      setCoins((prev) => prev.filter((c) => c._id !== id));

      return { success: true };
    } catch (err) {
      console.error("Delete coin error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete coin",
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    coins,
    loading,
    error,
    activeCoin,
    loadCoins,
    getCoin,
    createCoin,
    updateCoin,
    deleteCoin,
  };

  return (
    <CoinsContext.Provider value={value}>{children}</CoinsContext.Provider>
  );
};

export const useCoins = () => useContext(CoinsContext);
