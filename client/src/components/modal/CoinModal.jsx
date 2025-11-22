import { useEffect, useRef, useState } from "react";
import { useCoins } from "../../context/CoinsContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FaCamera, FaImage } from "react-icons/fa";

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

  return (
    <div className="fixed inset-0 z-50 flex justify-end isolate" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => onClose?.()}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="relative w-full sm:w-[540px] h-full bg-gray-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gray-900/50 backdrop-blur-md z-10 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {mode === "create" ? "Add New Coin" : "Edit Coin Details"}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {mode === "create" ? "Fill in the details to add a new coin to the collection." : "Update the information for this coin."}
            </p>
          </div>
          <button
            onClick={() => onClose?.()}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <form id="coin-form" onSubmit={handleSubmit} className="space-y-8">

            {/* Image Upload Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Front Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Front Image</label>
                <div className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-300 ${errors.frontImage ? 'border-red-500/50 bg-red-500/5' : 'border-dashed border-gray-700 bg-black/20'}`}>
                  {frontPreview && (
                    <img src={frontPreview} alt="Front preview" className="w-full h-full object-contain p-2" />
                  )}

                  {/* Overlay Controls */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-[2px] transition-all duration-200 ${frontPreview ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                    <span className="text-sm font-medium text-gray-300 mb-4">{frontPreview ? "Change Front Image" : "Add Front Image"}</span>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => document.getElementById('front-camera').click()}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-all group/btn"
                      >
                        <div className="p-3 rounded-full bg-teal-500/20 text-teal-400 group-hover/btn:bg-teal-500 group-hover/btn:text-white transition-colors shadow-lg shadow-teal-500/10">
                          <FaCamera size={20} />
                        </div>
                        <span className="text-xs font-medium text-gray-400 group-hover/btn:text-white">Camera</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => document.getElementById('front-gallery').click()}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-all group/btn"
                      >
                        <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 group-hover/btn:bg-purple-500 group-hover/btn:text-white transition-colors shadow-lg shadow-purple-500/10">
                          <FaImage size={20} />
                        </div>
                        <span className="text-xs font-medium text-gray-400 group-hover/btn:text-white">Gallery</span>
                      </button>
                    </div>
                  </div>
                </div>
                <input
                  id="front-camera"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => setFrontFile(e.target.files?.[0])}
                  className="hidden"
                />
                <input
                  id="front-gallery"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFrontFile(e.target.files?.[0])}
                  className="hidden"
                />
                {errors.frontImage && <p className="text-xs text-red-400 ml-1">{errors.frontImage}</p>}
              </div>

              {/* Rear Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Rear Image</label>
                <div className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-300 ${errors.rearImage ? 'border-red-500/50 bg-red-500/5' : 'border-dashed border-gray-700 bg-black/20'}`}>
                  {rearPreview && (
                    <img src={rearPreview} alt="Rear preview" className="w-full h-full object-contain p-2" />
                  )}

                  {/* Overlay Controls */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-[2px] transition-all duration-200 ${rearPreview ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                    <span className="text-sm font-medium text-gray-300 mb-4">{rearPreview ? "Change Rear Image" : "Add Rear Image"}</span>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => document.getElementById('rear-camera').click()}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-all group/btn"
                      >
                        <div className="p-3 rounded-full bg-teal-500/20 text-teal-400 group-hover/btn:bg-teal-500 group-hover/btn:text-white transition-colors shadow-lg shadow-teal-500/10">
                          <FaCamera size={20} />
                        </div>
                        <span className="text-xs font-medium text-gray-400 group-hover/btn:text-white">Camera</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => document.getElementById('rear-gallery').click()}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-all group/btn"
                      >
                        <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 group-hover/btn:bg-purple-500 group-hover/btn:text-white transition-colors shadow-lg shadow-purple-500/10">
                          <FaImage size={20} />
                        </div>
                        <span className="text-xs font-medium text-gray-400 group-hover/btn:text-white">Gallery</span>
                      </button>
                    </div>
                  </div>
                </div>
                <input
                  id="rear-camera"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => setRearFile(e.target.files?.[0])}
                  className="hidden"
                />
                <input
                  id="rear-gallery"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setRearFile(e.target.files?.[0])}
                  className="hidden"
                />
                {errors.rearImage && <p className="text-xs text-red-400 ml-1">{errors.rearImage}</p>}
              </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Denomination</label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-teal-400 transition-colors">₹</span>
                    <input
                      value={denomination}
                      onChange={(e) => {
                        const val = e.target.value.replace(/^\u20B9\s?/, "");
                        setDenomination(val);
                      }}
                      className={`w-full pl-8 pr-4 py-2.5 rounded-lg bg-white/5 border ${errors.denomination ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-teal-500/50'} text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500/50 focus:bg-white/10 transition-all`}
                      type="text"
                      placeholder="e.g. 10"
                    />
                  </div>
                  {errors.denomination && <p className="text-xs text-red-400 ml-1">{errors.denomination}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Year</label>
                  <input
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    type="number"
                    placeholder="e.g. 1947"
                    className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border ${errors.year ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-teal-500/50'} text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500/50 focus:bg-white/10 transition-all`}
                  />
                  {errors.year && <p className="text-xs text-red-400 ml-1">{errors.year}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Mint</label>
                  <div className="relative">
                    <select
                      value={mint}
                      onChange={(e) => setMint(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border ${errors.mint ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-teal-500/50'} text-white appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500/50 focus:bg-white/10 transition-all cursor-pointer`}
                    >
                      <option value="" className="bg-gray-900 text-gray-400">Select Mint Location</option>
                      <option value="Mumbai" className="bg-gray-900 text-white">Mumbai</option>
                      <option value="Hyderabad" className="bg-gray-900 text-white">Hyderabad</option>
                      <option value="Kolkata" className="bg-gray-900 text-white">Kolkata</option>
                      <option value="Noida" className="bg-gray-900 text-white">Noida</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.mint && <p className="text-xs text-red-400 ml-1">{errors.mint}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Condition (1-10)</label>
                  <input
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    type="number"
                    min="1"
                    max="10"
                    placeholder="10"
                    className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border ${errors.condition ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-teal-500/50'} text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500/50 focus:bg-white/10 transition-all`}
                  />
                  {errors.condition && <p className="text-xs text-red-400 ml-1">{errors.condition}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300 ml-1">Mark / Description</label>
                <input
                  value={mark}
                  onChange={(e) => setMark(e.target.value)}
                  placeholder="e.g. Diamond mark below date"
                  className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border ${errors.mark ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-teal-500/50'} text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500/50 focus:bg-white/10 transition-all`}
                />
                {errors.mark && <p className="text-xs text-red-400 ml-1">{errors.mark}</p>}
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/5 cursor-pointer transition-colors group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={isSpecial}
                      onChange={(e) => setIsSpecial(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-10 h-6 bg-gray-700 rounded-full peer-checked:bg-teal-500/80 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Mark this coin as a Special / Rare edition</span>
                </label>
              </div>
            </div>

            {errors.submit && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.submit}
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-gray-900/80 backdrop-blur-md z-10 shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-sm font-semibold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </div>
            ) : (
              mode === "create" ? "Create Coin" : "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
