import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Activitats from "./pages/Activitats";
import ActivitatDetall from "./pages/ActivitatDetall";
import InfoPractica from "./pages/InfoPractica";
import Contacte from "./pages/Contacte";
import Login from "./pages/Login";
import Register from "./pages/register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";

// Forçar l'scroll a dalt de la pàgina
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PublicRoute() {
  const { user } = useAuth();
  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  return (
    <div className="min-h-screen flex flex-col bg-[#e1d7bc]">
      <Navbar />
      <main className="grow pt-17">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />

      <Routes>
        {/* admin no puede entrar */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/activitats" element={<Activitats />} />
          <Route path="/activitats/:id" element={<ActivitatDetall />} />
          <Route path="/info-practica" element={<InfoPractica />} />
          <Route path="/contacte" element={<Contacte />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/perfil" element={<Profile />} />
        </Route>

        {/* solo admin puede entrar */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
