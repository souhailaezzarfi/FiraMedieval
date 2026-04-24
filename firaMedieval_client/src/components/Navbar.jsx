import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <nav className="bg-[#461615] border-b-2 border-[#432918] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-1">
          <Link
            to="/"
            className="font-serif font-bold text-3xl text-white tracking-wide"
          >
            Fira Medieval
          </Link>
        </div>

        <div className="flex gap-8 text-white font-bold tracking-wider text-lg justify-center">
          <Link to="/" className="hover:text-[#EAD9B0] transition-colors">
            Inici
          </Link>
          <Link
            to="/activitats"
            className="hover:text-[#EAD9B0] transition-colors"
          >
            Activitats
          </Link>
          <Link
            to="/info-practica"
            className="hover:text-[#EAD9B0] transition-colors"
          >
            Informació pràctica
          </Link>
          <Link
            to="/contacte"
            className="hover:text-[#EAD9B0] transition-colors"
          >
            Contacte
          </Link>
        </div>

        <div className="flex-1 flex justify-end">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-10 px-4 rounded-full border-2 border-white flex items-center gap-2 text-white font-medium hover:bg-[#e1d7bc]/25 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">
                  &#xe7fd;
                </span>
                <span>{user.nom}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  <Link
                    to="/perfil"
                    className="block px-4 py-2 text-[#432918] hover:bg-gray-100"
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Tancar sessió
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-[#e1d7bc]/25 transition-colors"
            >
              <span className="material-symbols-outlined text-white text-2xl">
                &#xe7fd;
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
