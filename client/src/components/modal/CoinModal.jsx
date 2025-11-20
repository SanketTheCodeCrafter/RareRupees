// filename: src/components/modal/CoinModal.jsx
import { useEffect, useRef, useState } from "react";
import { useCoins } from "../../context/CoinsContext";
import { useAuth } from "../../context/AuthContext";

export default function CoinModal({ initial = null, mode = "create", onClose }) {
  // initial: the coin object when editing; null when creating
  const { createCoin, updateCoin } = useCoins();
  const { isAdmin } = useAuth();

  const [frontFile, setFrontFile] = useState(null); // File object
  const [rearFile, setRearFile] = useState(null); // File object

  const [frontPreview, setFrontPreview] = useState("");
  const [rearPreview, setRearPreview] = useState("");

  const [denomination, setDenomination] = useState(initial?.denomination || "");
  const [year, setYear] = useState(initial?.year || "");
  const [mint, setMint] = useState(initial?.mint || "");
  const [condition, setCondition] = useState(initial?.condition ?? "");
  const [mark, setMark] = useState(initial?.mark || "");
  const [isSpecial, setIsSpecial] = useState(!!initial?.isSpecial);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const drawerRef = useRef(null);

  // Only admin can open modal for create/edit
  useEffect(() => {
    if (!isAdmin) {
      onClose?.();
    }
  }, [isAdmin]);

  // Populate previews from initial object (for edit)
  useEffect(() => {
    if (initial) {
      setFrontPreview(initial.frontImage || "");
      setRearPreview(initial.rearImage || "");
    } else {
      setFrontPreview("");
      setRearPreview("");
    }
  }, [initial]);

  // generate preview when file chosen
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

  // close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const validate = () => {
    const err = {};
    if (!denomination) err.denomination = "Denomination required";
    if (!year || isNaN(Number(year))) err.year = "Valid year required";
    if (!mint) err.mint = "Mint is required";
    if (condition === "" || condition === null || isNaN(Number(condition)))
      err.condition = "Condition required (number)";
    if (!mark) err.mark = "Mark is required";

    // On create both images required; on edit images optional
    if (mode === "create") {
      if (!frontFile && !frontPreview) err.frontImage = "Front image required";
      if (!rearFile && !rearPreview) err.rearImage = "Rear image required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const payload = {
        denomination,
        year: Number(year),
        mint,
        condition: Number(condition),
        mark,
        isSpecial: !!isSpecial,
      };

      const formData = new FormData();

      // Attach files only if present (for edit allow keeping previous)
      if (frontFile) formData.append("frontImage", frontFile);
      if (rearFile) formData.append("rearImage", rearFile);

      // Append fields
      Object.entries(payload).forEach(([k, v]) => {
        formData.append(k, v);
      });

      let resp;
      if (mode === "create") {
        resp = await createCoin(formData);
      } else {
        // initial._id must exist for edit
        resp = await updateCoin(initial._id, formData);
      }

      if (!resp || !resp.success) {
        // createCoin/updateCoin in context returns success flags
        throw new Error(resp?.message || "Save failed");
      }

      // success -> close
      onClose?.();
    } catch (err) {
      console.error("CoinModal submit error:", err);
      setErrors({ submit: err.message || "Failed to save" });
    } finally {
      setLoading(false);
    }
  };

  // click outside to close (backdrop)
  const handleBackdrop = (e) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target)) {
      onClose?.();
    }
  };

  // File inputs handlers
  const handleFrontPick = (file) => {
    if (!file) return;
    setFrontFile(file);
  };
  const handleRearPick = (file) => {
    if (!file) return;
    setRearFile(file);
  };

  // small helper: display preview fallback text if not available
  const renderPreview = (src, label) => {
    if (src) {
      return (
        <img
          src={src}
          alt={label}
          className="w-full h-48 object-contain rounded-md bg-black/20"
        />
      );
    }
    return (
      <div className="w-full h-48 flex items-center justify-center rounded-md bg-black/10 text-gray-400">
        {label} preview
      </div>
    );
  };

  // Drawer styles: full-screen on small, side drawer on md+
  return (
    <div
      className="fixed inset-0 z-50"
      onMouseDown={handleBackdrop}
      aria-modal="true"
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* drawer */}
      <div
        ref={drawerRef}
        onMouseDown={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 h-full w-full md:w-[540px] bg-gray-900 text-white shadow-2xl overflow-auto"
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {mode === "create" ? "Add Coin" : "Edit Coin"}
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // reset form if in create
                  if (mode === "create") {
                    setFrontFile(null);
                    setRearFile(null);
                    setFrontPreview("");
                    setRearPreview("");
                    setDenomination("");
                    setYear("");
                    setMint("");
                    setCondition("");
                    setMark("");
                    setIsSpecial(false);
                    setErrors({});
                  }
                  onClose?.();
                }}
                className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Images row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">Front Image</label>
                <div className="mt-2">{renderPreview(frontPreview, "Front")}</div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFrontPick(e.target.files?.[0])}
                  className="mt-3 w-full text-sm text-gray-300"
                />
                {errors.frontImage && (
                  <p className="text-xs text-red-400 mt-1">{errors.frontImage}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-300">Rear Image</label>
                <div className="mt-2">{renderPreview(rearPreview, "Rear")}</div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleRearPick(e.target.files?.[0])}
                  className="mt-3 w-full text-sm text-gray-300"
                />
                {errors.rearImage && (
                  <p className="text-xs text-red-400 mt-1">{errors.rearImage}</p>
                )}
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">Denomination</label>
                <input
                  value={denomination}
                  onChange={(e) => setDenomination(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded bg-black/20"
                />
                {errors.denomination && (
                  <p className="text-xs text-red-400 mt-1">{errors.denomination}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-300">Year</label>
                <input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  type="number"
                  className="mt-1 w-full px-3 py-2 rounded bg-black/20"
                />
                {errors.year && (
                  <p className="text-xs text-red-400 mt-1">{errors.year}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-300">Mint</label>
                <input
                  value={mint}
                  onChange={(e) => setMint(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded bg-black/20"
                />
                {errors.mint && (
                  <p className="text-xs text-red-400 mt-1">{errors.mint}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-300">Condition (1-10)</label>
                <input
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  type="number"
                  min="1"
                  max="10"
                  className="mt-1 w-full px-3 py-2 rounded bg-black/20"
                />
                {errors.condition && (
                  <p className="text-xs text-red-400 mt-1">{errors.condition}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-300">Mark</label>
                <input
                  value={mark}
                  onChange={(e) => setMark(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded bg-black/20"
                />
                {errors.mark && (
                  <p className="text-xs text-red-400 mt-1">{errors.mark}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={isSpecial}
                  onChange={(e) => setIsSpecial(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Mark as Special</span>
              </label>
            </div>

            {errors.submit && <div className="text-red-400">{errors.submit}</div>}

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded bg-teal-400 text-black font-semibold hover:bg-teal-300"
                disabled={loading}
              >
                {loading ? "Saving..." : mode === "create" ? "Create" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
