import React, {useState} from "react";
import teams from "../utils/teams";
import {useNavigate} from "react-router-dom";
import {registerUser} from "../api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    company: "",
    champion: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await registerUser(formData);
      alert("Registration successful. You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "User/Password Error. Try again.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-700 via-blue-600 to-purple-600 px-2">
      <div className="w-full max-w-md p-4 sm:p-8 space-y-6 bg-slate-900/90 rounded-2xl shadow-2xl border border-slate-700">
        <h2 className="text-3xl font-extrabold text-center text-white drop-shadow mb-2">
          Crear una cuenta
        </h2>
        <p className="text-center text-slate-300 mb-4">
          ¡Únete al concurso y compite por el primer lugar!
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* FIELD TO SELECT CHAMPION */}
          <div>
            <label
              htmlFor="champion"
              className="text-sm font-semibold text-slate-200"
            >
              ¿Quién será el campeón del Mundial? (Por 15 ptos)
            </label>
            <select
              id="champion"
              name="champion"
              value={formData.champion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-yellow-500 bg-slate-800 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            >
              <option value="" disabled>
                Selecciona un equipo...
              </option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="username"
              className="text-sm font-semibold text-slate-200"
            >
              Nombre de usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-indigo-500 bg-slate-800 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 placeholder:text-slate-400"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-indigo-500 bg-slate-800 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 placeholder:text-slate-400"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-200"
            >
              Contraseña
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 pr-14 border border-indigo-500 bg-slate-800 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center rounded-md bg-slate-700/95 ring-1 ring-slate-500/70 text-slate-100 hover:bg-slate-600 focus:outline-none"
                aria-label={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223a.75.75 0 0 1 .073-1.06A11.955 11.955 0 0 1 12 4.5c3.042 0 5.824 1.13 7.947 2.663a.75.75 0 0 1 .073 1.06A11.955 11.955 0 0 1 12 19.5c-3.042 0-5.824-1.13-7.947-2.663a.75.75 0 0 1-.073-1.06z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223a.75.75 0 0 1 .073-1.06A11.955 11.955 0 0 1 12 4.5c3.042 0 5.824 1.13 7.947 2.663a.75.75 0 0 1 .073 1.06A11.955 11.955 0 0 1 12 19.5c-3.042 0-5.824-1.13-7.947-2.663a.75.75 0 0 1-.073-1.06z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-400 font-semibold text-center">
              {error}
            </p>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:from-indigo-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
