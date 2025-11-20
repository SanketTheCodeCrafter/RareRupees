export default function CoinDetailModal({ coin, onClose }) {
  if (!coin) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex justify-center items-center p-4">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-2xl border border-gray-700">

        <h2 className="text-xl font-bold mb-4">{coin.denomination} — {coin.year}</h2>

        {/* IMAGES */}
        <div className="flex gap-4">
          <img src={coin.frontImage} className="w-1/2 h-52 object-cover rounded-lg" />
          <img src={coin.rearImage} className="w-1/2 h-52 object-cover rounded-lg" />
        </div>

        <div className="mt-4 text-gray-300">
          <p><b>Mint:</b> {coin.mint}</p>
          <p><b>Mark:</b> {coin.mark}</p>
          <p><b>Condition:</b> {coin.condition}/10</p>
          <p><b>Special:</b> {coin.isSpecial ? "Yes" : "No"}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-teal-400 text-black px-4 py-2 rounded-lg hover:bg-teal-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
