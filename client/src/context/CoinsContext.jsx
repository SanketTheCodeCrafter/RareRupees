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

import { compressImage } from "../utils/imageCompression";

import toast from "react-hot-toast";

const CoinsContext = createContext();

export const CoinsProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCoin, setActiveCoin] = useState(null);
  const [error, setError] = useState(null);

  // Upload State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [retryQueue, setRetryQueue] = useState(null); // { type: 'create'|'update', payload, id? }

  // Network Detection Helper
  const getNetworkConfig = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      const downlink = connection.downlink; // Mbps
      if (downlink && downlink < 1.5) {
        return { quality: 0.6, maxSizeMB: 0.5 };
      }
    }
    return { quality: 0.8, maxSizeMB: 1 };
  };

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
    const tempId = "temp_" + Date.now();
    const networkConfig = getNetworkConfig();

    try {
      setLoading(true);
      setIsUploading(true);
      setUploadProgress(0);
      setRetryQueue(null);

      // 1. Optimistic UI: Add temporary coin
      const tempCoin = {
        _id: tempId,
        ...payload,
        frontImage: payload.frontImage instanceof File ? URL.createObjectURL(payload.frontImage) : "",
        rearImage: payload.rearImage instanceof File ? URL.createObjectURL(payload.rearImage) : "",
        isOptimistic: true,
        createdAt: new Date().toISOString(),
      };
      setCoins((prev) => [tempCoin, ...prev]);

      // 2. Compress Images
      let compressedFront = payload.frontImage;
      let compressedRear = payload.rearImage;

      if (payload.frontImage instanceof File) {
        compressedFront = await compressImage(payload.frontImage, networkConfig);
      }
      if (payload.rearImage instanceof File) {
        compressedRear = await compressImage(payload.rearImage, networkConfig);
      }

      // 3. Prepare FormData
      const formData = new FormData();
      if (compressedFront instanceof File) formData.append("frontImage", compressedFront);
      if (compressedRear instanceof File) formData.append("rearImage", compressedRear);

      if (payload.denomination !== undefined) formData.append("denomination", payload.denomination);
      if (payload.year !== undefined) formData.append("year", payload.year);
      if (payload.mint !== undefined) formData.append("mint", payload.mint);
      if (payload.condition !== undefined) formData.append("condition", payload.condition);
      if (payload.mark !== undefined) formData.append("mark", payload.mark);
      if (payload.isSpecial !== undefined) formData.append("isSpecial", payload.isSpecial);

      // 4. API Call with Progress
      const res = await createCoinAPI(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      // 5. Handle Success
      const success =
        (res && res.data && typeof res.data.success !== "undefined" && res.data.success) ||
        (res && typeof res.success !== "undefined" && res.success) ||
        (res && typeof res.status === "number" && res.status >= 200 && res.status < 300);

      const respData = (res && res.data && res.data.data) || (res && res.data) || res;
      const message = (res && res.data && res.data.message) || (res && res.message);

      if (success || (respData && (respData._id || respData.id))) {
        const realCoin = respData;
        // Replace temp coin with real coin
        setCoins((prev) => prev.map((c) => (c._id === tempId ? realCoin : c)));
        toast.success(message || "Coin created");
        return { success: true, coin: realCoin };
      }

      throw new Error(message || "Create failed");

    } catch (err) {
      console.error("Create coin error:", err);
      const msg = err.response?.data?.message || err.message || "Create failed";
      toast.error(`${msg} - Click 'Retry' to try again.`);

      // Remove optimistic coin on failure (or keep it to show error state? Removing for now to avoid confusion, but saving to retryQueue)
      setCoins((prev) => prev.filter((c) => c._id !== tempId));

      // Save to retry queue
      setRetryQueue({ type: 'create', payload });

      return { success: false, message: msg };
    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // UPDATE coin
  const updateCoin = async (id, payload) => {
    const networkConfig = getNetworkConfig();

    try {
      setLoading(true);
      setIsUploading(true);
      setUploadProgress(0);
      setRetryQueue(null);

      // 1. Compress Images
      let compressedFront = payload.frontImage;
      let compressedRear = payload.rearImage;

      if (payload.frontImage instanceof File) {
        compressedFront = await compressImage(payload.frontImage, networkConfig);
      }
      if (payload.rearImage instanceof File) {
        compressedRear = await compressImage(payload.rearImage, networkConfig);
      }

      // 2. Prepare FormData
      const formData = new FormData();
      if (compressedFront instanceof File) formData.append("frontImage", compressedFront);
      if (compressedRear instanceof File) formData.append("rearImage", compressedRear);

      if (payload.denomination !== undefined) formData.append("denomination", payload.denomination);
      if (payload.year !== undefined) formData.append("year", payload.year);
      if (payload.mint !== undefined) formData.append("mint", payload.mint);
      if (payload.condition !== undefined) formData.append("condition", payload.condition);
      if (payload.mark !== undefined) formData.append("mark", payload.mark);
      if (payload.isSpecial !== undefined) formData.append("isSpecial", payload.isSpecial);

      // 3. API Call with Progress
      const res = await updateCoinAPI(id, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      // 4. Handle Success
      const success =
        (res && res.data && typeof res.data.success !== "undefined" && res.data.success) ||
        (res && typeof res.success !== "undefined" && res.success) ||
        (res && typeof res.status === "number" && res.status >= 200 && res.status < 300);

      const respData = (res && res.data && res.data.data) || (res && res.data) || res;
      const message = (res && res.data && res.data.message) || (res && res.message);

      if (success || (respData && (respData._id || respData.id))) {
        const updatedCoin = respData;
        setCoins((prev) => prev.map((c) => (c._id === id ? updatedCoin : c)));
        toast.success(message || "Coin updated");
        return { success: true, coin: updatedCoin };
      }

      throw new Error(message || "Update failed");

    } catch (err) {
      console.error("Update coin error:", err);
      const msg = err.response?.data?.message || err.message || "Update failed";
      toast.error(`${msg} - Click 'Retry' to try again.`);

      // Save to retry queue
      setRetryQueue({ type: 'update', id, payload });

      return { success: false, message: msg };
    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Retry Logic
  const retryFailedUpload = async () => {
    if (!retryQueue) return;

    const { type, payload, id } = retryQueue;
    setRetryQueue(null); // Clear queue before retrying

    if (type === 'create') {
      return await createCoin(payload);
    } else if (type === 'update') {
      return await updateCoin(id, payload);
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
        uploadProgress,
        isUploading,
        retryQueue,
        loadCoins,
        getCoin,
        createCoin,
        updateCoin,
        deleteCoin,
        retryFailedUpload,
      }}
    >
      {children}
    </CoinsContext.Provider>
  );
};

export const useCoins = () => useContext(CoinsContext);
