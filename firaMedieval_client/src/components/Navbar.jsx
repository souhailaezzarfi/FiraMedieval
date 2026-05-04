import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#461615] border-b border-white/20 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center ">
        <div className="flex-1">
          <Link
            to="/"
            className="font-serif font-bold text-3xl text-white tracking-wide"
          >
            Fira Medieval
          </Link>
        </div>

        <div className="flex gap-8 text-white font-bold tracking-wider text-lg justify-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors ${isActive ? "text-[#D4B06A]" : "hover:text-[#D4B06A]"}`
            }
          >
            Inici
          </NavLink>

          <NavLink
            to="/activitats"
            className={({ isActive }) =>
              `transition-colors ${isActive ? "text-[#D4B06A]" : "hover:text-[#D4B06A]"}`
            }
          >
            Activitats
          </NavLink>
          <NavLink
            to="/info-practica"
            className={({ isActive }) =>
              `transition-colors ${isActive ? "text-[#D4B06A]" : "hover:text-[#D4B06A]"}`
            }
          >
            Informació pràctica
          </NavLink>
          <NavLink
            to="/contacte"
            className={({ isActive }) =>
              `transition-colors ${isActive ? "text-[#D4B06A]" : "hover:text-[#D4B06A]"}`
            }
          >
            Contacte
          </NavLink>
        </div>

        <div className="flex-1 flex justify-end">
          {user ? (
            <div className="relative" ref={dropdownRef}>
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
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-[#432918] hover:bg-gray-100"
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                      navigate("/");
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
              className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-[#D4B06A] transition-colors"
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
