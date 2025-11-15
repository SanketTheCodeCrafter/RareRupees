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
      return res.status(400).json({ message: "Both images are required" });
    }

    // Upload to Cloudinary
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

    res.status(201).json(coin);

  } catch (err) {
    console.error("createCoin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCoin = async (req, res) => {
  try {
    const updates = req.body;

    const frontFile = req.files?.frontImage?.[0];
    const rearFile = req.files?.rearImage?.[0];

    if (frontFile) {
      updates.frontImage = await uploadBufferToCloudinary(frontFile.buffer, "rarerupees");
    }

    if (rearFile) {
      updates.rearImage = await uploadBufferToCloudinary(rearFile.buffer, "rarerupees");
    }

    const updated = await Coin.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updated) return res.status(404).json({ message: "Coin not found" });

    res.json(updated);

  } catch (err) {
    console.error("updateCoin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCoin = async (req, res) => {
  try {
    const removed = await Coin.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Coin not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("deleteCoin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
