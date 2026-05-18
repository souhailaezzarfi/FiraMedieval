import {
  NavLink,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { TiUserDelete } from "react-icons/ti";
import { useAuth } from "../context/AuthContext";
import Activitats from "./admin/Activitats";
import Usuaris from "./admin/Usuaris";
import userService from "../services/userService";
import Aparcaments from "./admin/Aparcaments";
import Reserves from "./admin/ReservesAutocaravanes";



const navItems = [
  { to: "/admin/activitats", label: "Activitats" },
  { to: "/admin/usuaris", label: "Usuaris" },
  { to: "/admin/aparcaments", label: "Aparcaments" },
  { to: "/admin/ReservesAutocaravanes", label: "ReservesAutocaravanes" },


];

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Segur que vols eliminar el teu compte?",
    );

    if (!confirmDelete) return;

    try {
      await userService.deleteProfile(user.id);

      logout();

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message ?? "No s'ha pogut eliminar el compte.");
    }
  };

  return (
    <div className="flex min-h-screen font-serif">
      <aside className="w-56 bg-[#1E0F07] flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="px-5 py-7 border-b border-[#D4A853]/20">
          <div className="text-3xl text-[#D4A853] font-bold  tracking-wide">
            Fira Medieval
          </div>
          <div className="text-[#D4A853]/50 text-lg mt-1">
            Panell d'administració
          </div>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-lg transition-all border-l-[3px] ` +
                (isActive
                  ? "text-[#D4A853] bg-[#D4A853]/10 border-[#D4A853]"
                  : "text-white/50 border-transparent hover:text-white/80 hover:bg-white/5")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-[#D4A853]/20 flex items-center gap-3">
          <Link
            to="/perfil"
            className="w-9 h-9 rounded-full bg-[#D4A853] flex items-center justify-center text-[#1E0F07] font-bold text-lg hover:opacity-90 transition-opacity"
          >
            A
          </Link>
          <div>
            <Link to="/perfil" className="text-lg font-bold text-[#D4A853]">
              {user.nom}
            </Link>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-lg transition-colors"
        >
          <CiLogout className="text-lg text-red-400 transition-colors" />
          Tancar sessió
        </button>

        <button
          onClick={handleDeleteAccount}
          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-lg transition-colors"
        >
          <TiUserDelete className="text-xl" />
          Eliminar compte
        </button>
      </aside>

      <main className="flex-1 bg-[#F7F2E8] min-h-screen">
        <Routes>
          <Route index element={<Navigate to="activitats" replace />} />
          <Route path="activitats" element={<Activitats />} />
          <Route path="usuaris" element={<Usuaris />} />
          <Route path="aparcaments" element={<Aparcaments />} />
          <Route path="ReservesAutocaravanes" element={<Reserves />} />


        </Routes>
      </main>
    </div>
  );
}
