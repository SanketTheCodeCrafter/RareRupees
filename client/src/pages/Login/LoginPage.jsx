import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await login(username, password);
    if (res.success) navigate("/");
    else alert(res.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070a]">
      <div className="bg-white/10 border border-white/20 p-8 rounded-xl backdrop-blur-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>

        <input
          className="w-full mb-3 p-2 rounded bg-black/30 text-white"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 rounded bg-black/30 text-white"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 rounded bg-teal-400 text-black font-bold hover:bg-teal-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
