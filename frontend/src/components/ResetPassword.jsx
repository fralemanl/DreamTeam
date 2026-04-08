import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { confirmResetPassword } from "../api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await confirmResetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid or expired link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-2">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h2 className="text-2xl font-black text-white mb-2 text-center">
          Reset Password
        </h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          Enter your new password below.
        </p>

        {done ? (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-4 rounded-lg text-center text-sm">
            ✓ Password updated successfully! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm text-center">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-slate-400 text-sm font-bold mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 pr-14 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-md bg-slate-700/95 ring-1 ring-slate-500/70 text-slate-100 hover:bg-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223a.75.75 0 0 1 .073-1.06A11.955 11.955 0 0 1 12 4.5c3.042 0 5.824 1.13 7.947 2.663a.75.75 0 0 1 .073 1.06A11.955 11.955 0 0 1 12 19.5c-3.042 0-5.824-1.13-7.947-2.663a.75.75 0 0 1-.073-1.06z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223a.75.75 0 0 1 .073-1.06A11.955 11.955 0 0 1 12 4.5c3.042 0 5.824 1.13 7.947 2.663a.75.75 0 0 1 .073 1.06A11.955 11.955 0 0 1 12 19.5c-3.042 0-5.824-1.13-7.947-2.663a.75.75 0 0 1-.073-1.06z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-slate-400 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-green-900/20 transition-all transform active:scale-95"
            >
              {loading ? "Saving..." : "Set New Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
