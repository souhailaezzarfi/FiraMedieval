import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-1">
          <Link
            to="/"
            className="font-serif font-bold text-3xl text-gray-900 tracking-wide"
          >
            Fira Medieval
          </Link>
        </div>

        <div className="flex gap-8 text-gray-600 font-medium justify-center">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Inici
          </Link>
          <Link
            to="/activitats"
            className="hover:text-blue-600 transition-colors"
          >
            Activitats
          </Link>
          <Link
            to="/info-practica"
            className="hover:text-blue-600 transition-colors"
          >
            Informació pràctica
          </Link>
          <Link
            to="/contacte"
            className="hover:text-blue-600 transition-colors"
          >
            Contacte
          </Link>
        </div>

        <div className="flex-1 flex justify-end">
          <Link
            to="/perfil"
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-600 text-2xl">
              &#xe7fd;
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
