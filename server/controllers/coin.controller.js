import Coin from '../models/Coin.js';
import { uploadBufferToCloudinary } from '../utils/cloudinary.js';

export const getCoins = async (req, res) => {
  try {
    const coins = await Coin.find().sort({ createdAt: -1 });
    res.json(coins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCoinById = async (req, res) => {
  try {
    const coin = await Coin.findById(req.params.id);
    if (!coin) return res.status(404).json({ message: "Coin not found" });
    res.json(coin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createCoin = async (req, res) => {
  try {
    const {
      denomination,
      year,
      mint,
      condition,
      mark,
      isSpecial
    } = req.body;

    const frontFile = req.files?.frontImage?.[0];
    const rearFile = req.files?.rearImage?.[0];

    if (!frontFile || !rearFile) {
      return res.status(400).json({ success: false, message: "Both images are required" });
    }

    const frontImageUrl = await uploadBufferToCloudinary(frontFile.buffer, "rarerupees");
    const rearImageUrl = await uploadBufferToCloudinary(rearFile.buffer, "rarerupees");

    const coin = new Coin({
      frontImage: frontImageUrl,
      rearImage: rearImageUrl,
      denomination,
      year,
      mint,
      condition,
      mark,
      isSpecial
    });

    await coin.save();

    res.status(201).json({
      success: true,
      message: "Coin created successfully",
      data: coin
    });

  } catch (err) {
    console.error("createCoin error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCoin = async (req, res) => {
  try {
    const updates = req.body || {};

    // Sanitize incoming updates: remove unset/empty values and cast types
    const sanitized = {};
    const numericFields = ["year", "condition"];
    for (const [key, val] of Object.entries(updates)) {
      if (val === undefined || val === null) continue;
      if (typeof val === "string") {
        const trimmed = val.trim();
        if (trimmed === "" || trimmed.toLowerCase() === "undefined") continue;
        if (numericFields.includes(key)) {
          const n = Number(trimmed);
          if (!Number.isNaN(n)) sanitized[key] = n;
          continue;
        }
        if (key === "isSpecial") {
          const lower = trimmed.toLowerCase();
          if (lower === "true" || lower === "false") sanitized[key] = lower === "true";
          else sanitized[key] = Boolean(trimmed);
          continue;
        }
        sanitized[key] = trimmed;
        continue;
      }
      sanitized[key] = val;
    }

    const frontFile = req.files?.frontImage?.[0];
    const rearFile = req.files?.rearImage?.[0];

    if (frontFile) {
      sanitized.frontImage = await uploadBufferToCloudinary(frontFile.buffer, "rarerupees");
    }

    if (rearFile) {
      sanitized.rearImage = await uploadBufferToCloudinary(rearFile.buffer, "rarerupees");
    }

    const updated = await Coin.findByIdAndUpdate(req.params.id, sanitized, { new: true, runValidators: true });

    if (!updated) return res.status(404).json({ success: false, message: "Coin not found" });

    res.json({ success: true, message: "Coin updated successfully", data: updated });
  } catch (err) {
    console.error("updateCoin error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

export const deleteCoin = async (req, res) => {
  try {
    const removed = await Coin.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ success: false, message: "Coin not found" });
    res.json({ success: true, message: "Coin deleted successfully" });
  } catch (err) {
    console.error("deleteCoin error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};
