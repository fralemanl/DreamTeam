import React, {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import MatchList from "./components/MatchList";
import Predictions from "./components/Predictions";
import Leaderboard from "./components/Leaderboard";
import AdminPanel from "./components/AdminPanel";
import Welcome from "./components/Welcome";
import HowToPlay from "./components/HowToPlay";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // Validación estricta de usuario
  const isValidUser = user && user.id && user.username && user.email;

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.id && parsed.username && parsed.email) {
          setUser(parsed);
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch {
        setUser(null);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    window.location.href = "/bienvenida";
    localStorage.setItem("user", JSON.stringify(userData));
    // Guardar también is_admin y user_id para compatibilidad con AdminPanel
    localStorage.setItem("is_admin", userData.is_admin ? "true" : "false");
    localStorage.setItem("user_id", String(userData.id));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("user_id");
  };

  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-200 font-sans overflow-x-hidden">
        {/* Navbar */}
        <nav className="bg-slate-800 border-b border-slate-700 shadow-lg sticky top-0 z-50 relative">
          <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
            <div className="flex items-center justify-between gap-3">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-black text-white tracking-tight hover:text-green-400 transition-colors min-w-0"
              >
                <img
                  src="/img/logo.png"
                  alt="Logo Park and Padel"
                  className="w-12 h-12 sm:w-20 sm:h-20 object-contain bg-white rounded shadow"
                  style={{marginBottom: 0}}
                />
                <span className="truncate">
                  Copa del Mundo 2026 <span className="text-green-500">Quiniela</span>
                </span>
              </Link>

              <button
                className="sm:hidden p-2 rounded-lg bg-slate-700 text-white"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Abrir menú"
                aria-expanded={menuOpen}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <div className="hidden sm:flex items-center gap-4">
                {isValidUser ? (
                  <>
                    <Link to="/bienvenida" className="font-medium hover:text-green-400 transition-colors">Bienvenido</Link>
                    <Link to="/partidos" className="font-medium hover:text-green-400 transition-colors">Mis predicciones</Link>
                    <Link to="/predicciones" className="font-medium hover:text-green-400 transition-colors">Mis puntos</Link>
                    <Link to="/clasificacion" className="font-medium hover:text-green-400 transition-colors">Clasificación</Link>
                    <Link to="/como-jugar" className="font-medium hover:text-green-400 transition-colors">Cómo jugar?</Link>
                    {user.is_admin && (
                      <Link to="/admin" className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors">Admin</Link>
                    )}
                    <span className="bg-slate-700 px-3 py-1 rounded-full text-sm font-bold border border-slate-600">{user.username}</span>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                    >
                      Salir
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/como-jugar" className="font-medium hover:text-green-400 transition-colors py-2">Cómo jugar?</Link>
                    <Link to="/login" className="font-medium hover:text-green-400 transition-colors py-2">Iniciar sesión</Link>
                    <Link to="/registro" className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg font-bold shadow-lg shadow-green-900/20 transition-all transform active:scale-95">Registrarse</Link>
                  </>
                )}
              </div>
            </div>

            <div className={`${menuOpen ? "flex" : "hidden"} sm:hidden mt-2 flex-col gap-2 bg-slate-800 border border-slate-700 rounded-xl p-3`}>
              {isValidUser ? (
                <>
                  <Link to="/bienvenida" onClick={closeMobileMenu} className="w-full text-center font-medium hover:text-green-400 py-2">Bienvenido</Link>
                  <Link to="/partidos" onClick={closeMobileMenu} className="w-full text-center font-medium hover:text-green-400 py-2">Mis predicciones</Link>
                  <Link to="/predicciones" onClick={closeMobileMenu} className="w-full text-center font-medium hover:text-green-400 py-2">Mis puntos</Link>
                  <Link to="/clasificacion" onClick={closeMobileMenu} className="w-full text-center font-medium hover:text-green-400 py-2">Clasificación</Link>
                  <Link to="/como-jugar" onClick={closeMobileMenu} className="w-full text-center font-medium hover:text-green-400 py-2">Cómo jugar?</Link>
                  {user.is_admin && (
                    <Link to="/admin" onClick={closeMobileMenu} className="w-full text-center font-medium text-yellow-400 hover:text-yellow-300 py-2">Admin</Link>
                  )}
                  <span className="bg-slate-700 px-3 py-2 rounded-full text-sm font-bold border border-slate-600 text-center">{user.username}</span>
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      handleLogout();
                    }}
                    className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/como-jugar" onClick={closeMobileMenu} className="w-full text-center font-medium hover:text-green-400 py-2">Cómo jugar?</Link>
                  <Link to="/login" onClick={closeMobileMenu} className="w-full text-center font-medium hover:text-green-400 py-2">Iniciar sesión</Link>
                  <Link to="/registro" onClick={closeMobileMenu} className="w-full text-center bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg font-bold">Registrarse</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <Routes>
            <Route
              path="/"
              element={
                isValidUser ? (
                  <Navigate to="/bienvenida" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/login"
              element={
                isValidUser ? (
                  <Navigate to="/bienvenida" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/bienvenida"
              element={
                isValidUser ? <Welcome user={user} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/registro"
              element={
                isValidUser ? (
                  <Navigate to="/partidos" />
                ) : (
                  <Register onRegister={handleLogin} />
                )
              }
            />
            <Route
              path="/partidos"
              element={
                isValidUser ? (
                  <MatchList user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/predicciones"
              element={
                isValidUser ? (
                  <Predictions user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/clasificacion"
              element={isValidUser ? <Leaderboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={
                isValidUser && user.is_admin ? (
                  <AdminPanel />
                ) : (
                  <Navigate to="/partidos" />
                )
              }
            />
            <Route path="/como-jugar" element={<HowToPlay />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-slate-800 text-white py-8 mt-12 border-t border-slate-700">
          <div className="container mx-auto px-4 flex flex-col items-center">
            <img src="/img/logo.png" alt="Park and Padel Logo" className="w-24 h-24 mb-4 object-contain bg-white rounded shadow" />
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
