// filename: src/components/dashboard/AddCoinButton.jsx
import { useAuth } from "../../context/AuthContext";

export default function AddCoinButton({ onClick }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-teal-400 text-black
                 text-3xl font-bold shadow-xl hover:bg-teal-300 transition"
    >
      +
    </button>
  );
}
