import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-[#d7b731] border-b border-[#432918] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-1">
          <Link
            to="/"
            className="font-serif font-bold text-3xl text-[#432918] tracking-wide"
          >
            Fira Medieval
          </Link>
        </div>

        <div className="flex gap-8 text-white font-bold tracking-wider text-lg justify-center">
          <Link to="/" className="hover:text-[#ba5940] transition-colors">
            Inici
          </Link>
          <Link
            to="/activitats"
            className="hover:text-[#ba5940] transition-colors"
          >
            Activitats
          </Link>
          <Link
            to="/info-practica"
            className="hover:text-[#ba5940] transition-colors"
          >
            Informació pràctica
          </Link>
          <Link
            to="/contacte"
            className="hover:text-[#ba5940] transition-colors"
          >
            Contacte
          </Link>
        </div>

        <div className="flex-1 flex justify-end">
          <Link
            to="/login"
            className="w-10 h-10 rounded-full border border-[#432918] flex items-center justify-center hover:bg-[#e1d7bc] transition-colors"
          >
            <span className="material-symbols-outlined text-[#432918] text-2xl">
              &#xe7fd;
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
