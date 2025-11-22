import { FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function CoinDetailModal({ coin, onClose }) {
  if (!coin) return null;

  // State to toggle between front and rear image in the main view
  const [activeImage, setActiveImage] = useState(coin.frontImage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] md:max-h-none bg-gray-900/95 border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row animate-slide-in-right overflow-y-auto md:overflow-hidden">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-20 backdrop-blur-md"
        >
          <FaTimes size={20} />
        </button>

        {/* Left: Images */}
        <div className="w-full md:w-1/2 bg-black/40 p-6 md:p-8 flex flex-col gap-6 items-center justify-center border-b md:border-b-0 md:border-r border-white/5 relative shrink-0">
          {/* Main Image */}
          <div className="relative w-full aspect-square max-w-[280px] md:max-w-sm group flex items-center justify-center">
            <img
              src={activeImage}
              alt="Coin Detail"
              className="w-full h-full object-contain drop-shadow-2xl transition-all duration-500"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 md:gap-4 overflow-x-auto w-full justify-center py-2">
            <button
              onClick={() => setActiveImage(coin.frontImage)}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === coin.frontImage ? 'border-teal-500 scale-105' : 'border-white/10 hover:border-white/30'}`}
            >
              <img src={coin.frontImage} className="w-full h-full object-cover" alt="Front Thumbnail" />
            </button>
            <button
              onClick={() => setActiveImage(coin.rearImage || coin.frontImage)}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === (coin.rearImage || coin.frontImage) ? 'border-teal-500 scale-105' : 'border-white/10 hover:border-white/30'}`}
            >
              <img src={coin.rearImage || coin.frontImage} className="w-full h-full object-cover" alt="Rear Thumbnail" />
            </button>
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-gray-900/50">
          <div className="mb-6 md:mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {coin.isSpecial ? coin.denomination : (coin.denomination.toString().startsWith('₹') ? coin.denomination : `₹${coin.denomination}`)}
            </h2>
            <p className="text-xl md:text-2xl text-teal-400 font-light">{coin.year}</p>
          </div>

          <div className="space-y-6 md:space-y-8 flex-1">
            <div className="grid grid-cols-2 gap-y-6 md:gap-y-8 gap-x-4">
              <div>
                <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mb-1 md:mb-2 font-semibold">Mint Location</p>
                <p className="text-lg md:text-xl text-gray-200 font-medium">{coin.mint}</p>
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mb-1 md:mb-2 font-semibold">Mint Mark</p>
                <p className="text-lg md:text-xl text-gray-200 font-medium truncate" title={coin.mark}>{coin.mark}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mb-1 md:mb-2 font-semibold">Condition</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-800 rounded-full h-2.5 md:h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(coin.condition / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-bold text-lg">{coin.condition}/10</span>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mb-1 md:mb-2 font-semibold">Edition Type</p>
                <div className="flex items-start">
                  <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-bold border ${coin.isSpecial ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                    {coin.isSpecial ? '✨ Special' : 'Standard'}
                  </span>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
