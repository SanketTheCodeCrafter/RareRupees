import Coin from '../models/Coin.js';
import { uploadBufferToCloudinary } from '../utils/cloudinary.js';

export const getCoins = async (req, res) => {
  try {
    const coins = await Coin.find().sort({ createdAt: -1 });
    res.json(coins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCoinById = async (req, res) => {
  try {
    const coin = await Coin.findById(req.params.id);
    if (!coin) return res.status(404).json({ success: false, message: "Coin not found" });
    res.json(coin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Helper: Upload with timeout
const uploadWithTimeout = (buffer, folder, timeoutMs = 40000) => {
  return Promise.race([
    uploadBufferToCloudinary(buffer, folder),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Upload timed out")), timeoutMs)
    ),
  ]);
};

export const createCoin = async (req, res) => {
  try {
    const {
      denomination,
      year,
      mint,
      condition,
      mark,
      isSpecial,
      useBackgroundUpload // Optional flag
    } = req.body;

    const frontFile = req.files?.frontImage?.[0];
    const rearFile = req.files?.rearImage?.[0];

    if (!frontFile || !rearFile) {
      return res.status(400).json({ success: false, message: "Both images are required" });
    }

    // BACKGROUND UPLOAD MODE (Optional)
    if (useBackgroundUpload === 'true' || useBackgroundUpload === true) {
      // 1. Create coin with "processing" status (or placeholder images)
      const coin = new Coin({
        frontImage: "https://res.cloudinary.com/demo/image/upload/v1/loading.png", // Placeholder
        rearImage: "https://res.cloudinary.com/demo/image/upload/v1/loading.png",  // Placeholder
        denomination,
        year,
        mint,
        condition,
        mark,
        isSpecial,
        // status: 'processing' // If schema supported it
      });

      await coin.save();

      // 2. Start uploads in background (fire and forget)
      // Note: In production, use a proper queue like BullMQ. Here we use setImmediate.
      setImmediate(async () => {
        try {
          const [frontUrl, rearUrl] = await Promise.all([
            uploadWithTimeout(frontFile.buffer, "rarerupees"),
            uploadWithTimeout(rearFile.buffer, "rarerupees"),
          ]);

          coin.frontImage = frontUrl;
          coin.rearImage = rearUrl;
          await coin.save();
          console.log(`Background upload complete for coin ${coin._id}`);
        } catch (bgErr) {
          console.error(`Background upload failed for coin ${coin._id}`, bgErr);
          // Optionally update coin status to 'failed'
        }
      });

      return res.status(201).json({
        success: true,
        message: "Coin creation started. Images are uploading in background.",
        data: coin
      });
    }

    // STANDARD PARALLEL UPLOAD
    // Upload both images in parallel with timeout
    const [frontImageUrl, rearImageUrl] = await Promise.all([
      uploadWithTimeout(frontFile.buffer, "rarerupees"),
      uploadWithTimeout(rearFile.buffer, "rarerupees"),
    ]);

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
    res.status(500).json({ success: false, message: err.message || "Server error" });
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

    // Parallel upload for updates if both are present, or single if one
    const uploadPromises = [];
    if (frontFile) {
      uploadPromises.push(
        uploadWithTimeout(frontFile.buffer, "rarerupees").then(url => ({ key: 'frontImage', url }))
      );
    }
    if (rearFile) {
      uploadPromises.push(
        uploadWithTimeout(rearFile.buffer, "rarerupees").then(url => ({ key: 'rearImage', url }))
      );
    }

    if (uploadPromises.length > 0) {
      const results = await Promise.all(uploadPromises);
      results.forEach(({ key, url }) => {
        sanitized[key] = url;
      });
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
