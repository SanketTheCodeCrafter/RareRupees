import { useEffect, useRef, useState } from "react";
import { useCoins } from "../../context/CoinsContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function CoinModal({ initial = null, mode = "create", onClose }) {
  const { createCoin, updateCoin } = useCoins();
  const { isAdmin } = useAuth();

  const [frontFile, setFrontFile] = useState(null); // File object
  const [rearFile, setRearFile] = useState(null); // File object
  const [frontPreview, setFrontPreview] = useState("");
  const [rearPreview, setRearPreview] = useState("");

  const [denomination, setDenomination] = useState(initial?.denomination || "");
  const [year, setYear] = useState(initial?.year ?? "");
  const [mint, setMint] = useState(initial?.mint || "");
  const [condition, setCondition] = useState(initial?.condition ?? "");
  const [mark, setMark] = useState(initial?.mark || "");
  const [isSpecial, setIsSpecial] = useState(!!initial?.isSpecial);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const drawerRef = useRef(null);

  // Ensure only admin can use it
  useEffect(() => {
    if (!isAdmin) onClose?.();
  }, [isAdmin]);

  // Pre-fill previews from initial (edit mode)
  useEffect(() => {
    if (initial) {
      setFrontPreview(initial.frontImage || "");
      setRearPreview(initial.rearImage || "");
      setDenomination(initial.denomination || "");
      setYear(initial.year ?? "");
      setMint(initial.mint || "");
      setCondition(initial.condition ?? "");
      setMark(initial.mark || "");
      setIsSpecial(!!initial.isSpecial);
    } else {
      setFrontPreview("");
      setRearPreview("");
    }
  }, [initial]);

  // create object URLs for selected files
  useEffect(() => {
    let fUrl;
    if (frontFile) {
      fUrl = URL.createObjectURL(frontFile);
      setFrontPreview(fUrl);
    }
    return () => {
      if (fUrl) URL.revokeObjectURL(fUrl);
    };
  }, [frontFile]);

  useEffect(() => {
    let rUrl;
    if (rearFile) {
      rUrl = URL.createObjectURL(rearFile);
      setRearPreview(rUrl);
    }
    return () => {
      if (rUrl) URL.revokeObjectURL(rUrl);
    };
  }, [rearFile]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Validation
  const validate = () => {
    const err = {};
    if (!denomination) err.denomination = "Denomination required";
    // For create require year; for edit allow blank to keep existing
    if (mode === "create") {
      if (year === "" || isNaN(Number(year))) err.year = "Valid year required";
    } else {
      if (year !== "" && isNaN(Number(year))) err.year = "Valid year required";
    }
    if (!mint) err.mint = "Mint is required";
    if (mode === "create") {
      if (condition === "" || condition === null || isNaN(Number(condition)))
        err.condition = "Condition required (number)";
    } else {
      if (condition !== "" && isNaN(Number(condition)))
        err.condition = "Condition must be a number";
    }
    if (!mark) err.mark = "Mark is required";

    // On create both images are required (unless previews exist)
    if (mode === "create") {
      if (!frontFile && !frontPreview) err.frontImage = "Front image required";
      if (!rearFile && !rearPreview) err.rearImage = "Rear image required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please check the form for errors.");
      return;
    }
    setLoading(true);

    try {
      // Build payload object — do NOT send "undefined"
      const payload = {
        // Use form state if present, otherwise fall back to initial (for edit)
        denomination: denomination || initial?.denomination || "",
        // For year/condition convert only if non-empty; otherwise leave undefined so backend keeps old
        year: year !== "" ? Number(year) : undefined,
        mint: mint || initial?.mint || "",
        condition: condition !== "" ? Number(condition) : undefined,
        mark: mark || initial?.mark || "",
        isSpecial: !!isSpecial,
        // Attach files only as File objects (CoinsContext will detect File and convert to FormData)
        frontImage: frontFile || undefined,
        rearImage: rearFile || undefined,
      };

      let resp;
      if (mode === "create") {
        resp = await createCoin(payload);
      } else {
        resp = await updateCoin(initial._id, payload);
      }

      if (!resp || !resp.success) {
        throw new Error(resp?.message || "Save failed");
      }

      onClose?.();
    } catch (err) {
      console.error("CoinModal submit error:", err);
      const msg = err.message || "Failed to save";
      setErrors({ submit: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdrop = (e) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target)) {
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50" onMouseDown={handleBackdrop} aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        ref={drawerRef}
        onMouseDown={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 h-full w-full md:w-[540px] bg-gray-900 text-white shadow-2xl overflow-auto"
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{mode === "create" ? "Add Coin" : "Edit Coin"}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onClose?.()}
                className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">Front Image</label>
                <div className="mt-2">
                  {frontPreview ? (
                    <img src={frontPreview} alt="Front preview" className="w-full h-48 object-contain rounded-md bg-black/20" />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center rounded-md bg-black/10 text-gray-400">
                      Front preview
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFrontFile(e.target.files?.[0])}
                  className="mt-3 w-full text-sm text-gray-300"
                />
                {errors.frontImage && <p className="text-xs text-red-400 mt-1">{errors.frontImage}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-300">Rear Image</label>
                <div className="mt-2">
                  {rearPreview ? (
                    <img src={rearPreview} alt="Rear preview" className="w-full h-48 object-contain rounded-md bg-black/20" />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center rounded-md bg-black/10 text-gray-400">
                      Rear preview
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setRearFile(e.target.files?.[0])}
                  className="mt-3 w-full text-sm text-gray-300"
                />
                {errors.rearImage && <p className="text-xs text-red-400 mt-1">{errors.rearImage}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">Denomination</label>
                <input value={denomination} onChange={(e) => setDenomination(e.target.value)} className="mt-1 w-full px-3 py-2 rounded bg-black/20" />
                {errors.denomination && <p className="text-xs text-red-400 mt-1">{errors.denomination}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-300">Year</label>
                <input value={year} onChange={(e) => setYear(e.target.value)} type="number" className="mt-1 w-full px-3 py-2 rounded bg-black/20" />
                {errors.year && <p className="text-xs text-red-400 mt-1">{errors.year}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-300">Mint</label>
                <input value={mint} onChange={(e) => setMint(e.target.value)} className="mt-1 w-full px-3 py-2 rounded bg-black/20" />
                {errors.mint && <p className="text-xs text-red-400 mt-1">{errors.mint}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-300">Condition (1-10)</label>
                <input value={condition} onChange={(e) => setCondition(e.target.value)} type="number" min="1" max="10" className="mt-1 w-full px-3 py-2 rounded bg-black/20" />
                {errors.condition && <p className="text-xs text-red-400 mt-1">{errors.condition}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-300">Mark</label>
                <input value={mark} onChange={(e) => setMark(e.target.value)} className="mt-1 w-full px-3 py-2 rounded bg-black/20" />
                {errors.mark && <p className="text-xs text-red-400 mt-1">{errors.mark}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={isSpecial} onChange={(e) => setIsSpecial(e.target.checked)} className="w-4 h-4" />
                <span>Mark as Special</span>
              </label>
            </div>

            {errors.submit && <div className="text-red-400">{errors.submit}</div>}

            <div className="flex items-center justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700" disabled={loading}>Cancel</button>

              <button type="submit" className="px-4 py-2 rounded bg-teal-400 text-black font-semibold hover:bg-teal-300" disabled={loading}>
                {loading ? "Saving..." : mode === "create" ? "Create" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
