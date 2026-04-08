import React, {useState} from "react";
import {loginUser} from "../api";

function Login({onLogin}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({username, password});
      onLogin(response.data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail === "Credenciales inválidas") {
        setError("Usuario y/o Password incorrecto");
      } else {
        setError(detail || "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 sm:mt-10 px-2">
      <div className="bg-slate-800 p-4 sm:p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h2 className="text-3xl font-black text-white mb-6 text-center">
          Login to Your Account
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-slate-400 text-sm font-bold mb-2">
              User
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-slate-400 text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 pr-14 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center rounded-md bg-slate-700/95 ring-1 ring-slate-500/70 text-slate-100 hover:bg-slate-600 focus:outline-none"
                aria-label={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223a.75.75 0 0 1 .073-1.06A11.955 11.955 0 0 1 12 4.5c3.042 0 5.824 1.13 7.947 2.663a.75.75 0 0 1 .073 1.06A11.955 11.955 0 0 1 12 19.5c-3.042 0-5.824-1.13-7.947-2.663a.75.75 0 0 1-.073-1.06z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223a.75.75 0 0 1 .073-1.06A11.955 11.955 0 0 1 12 4.5c3.042 0 5.824 1.13 7.947 2.663a.75.75 0 0 1 .073 1.06A11.955 11.955 0 0 1 12 19.5c-3.042 0-5.824-1.13-7.947-2.663a.75.75 0 0 1-.073-1.06z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 4.5l15 15"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-green-900/20 transition-all transform active:scale-95"
            disabled={loading}
          >
            {loading ? "Login..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400 text-sm">
          Don't have an account?{" "}
          <a
            href="/registro"
            className="text-green-400 hover:underline font-bold"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
