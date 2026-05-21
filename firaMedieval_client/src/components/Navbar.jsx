import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex-1">
          <Link to="/" className="flex flex-col w-fit group">
            <span className="font-serif font-bold text-3xl text-white tracking-wide leading-none">
              Fira Medieval
            </span>
            <span className="font-sans text-[16px] font-bold text-[#ead9b0] tracking-[0.5em] uppercase leading-none scale-y-75 transform origin-top text-center">
              Hostalric
            </span>
          </Link>
        </div>

        <div className="hidden md:flex gap-8 text-white font-bold tracking-wider text-lg justify-center flex-1 whitespace-nowrap">
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

        <div className="flex-1 flex justify-end items-center gap-3">
          <div>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-10 px-4 rounded-full border border-white flex items-center gap-2 text-white font-medium hover:bg-[#e1d7bc]/25 transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl">
                    &#xe7fd;
                  </span>
                  <span className="hidden sm:inline">{user.nom}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-[#432918] hover:bg-gray-100"
                      >
                        Panel d'administració
                      </Link>
                    )}
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

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full border border-white flex items-center justify-center text-white focus:outline-none select-none hover:bg-[#e1d7bc]/25 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl block">
              {isMobileMenuOpen ? <>&#xe5cd;</> : <>&#xe5d2;</>}
            </span>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-75 border-t border-white/10" : "max-h-0"
        }`}
      >
        <div className="bg-[#461615] px-6 py-2 flex flex-col items-center text-white font-bold tracking-wider text-lg">
          <NavLink
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `w-full text-center py-3 border-b border-white/10 transition-colors ${isActive ? "text-[#D4B06A]" : "hover:text-[#D4B06A]"}`
            }
          >
            Inici
          </NavLink>
          <NavLink
            to="/activitats"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `w-full text-center py-3 border-b border-white/10 transition-colors ${isActive ? "text-[#D4B06A]" : "hover:text-[#D4B06A]"}`
            }
          >
            Activitats
          </NavLink>
          <NavLink
            to="/info-practica"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `w-full text-center py-3 border-b border-white/10 transition-colors ${isActive ? "text-[#D4B06A]" : "hover:text-[#D4B06A]"}`
            }
          >
            Informació pràctica
          </NavLink>
          <NavLink
            to="/contacte"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `w-full text-center py-3 transition-colors ${isActive ? "text-[#D4B06A]" : "hover:text-[#D4B06A]"}`
            }
          >
            Contacte
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
