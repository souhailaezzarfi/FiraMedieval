import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import InfoPractica from "./pages/InfoPractica";
import Contacte from "./pages/Contacte";
import Login from "./pages/Login";
import Register from "./pages/register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";

function PublicRoute() {
  const { user } = useAuth();
  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  return (
    <div className="min-h-screen flex flex-col bg-[#e1d7bc]">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
function AdminRoute({ children }) {
  const { user } = useAuth();
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
      <Routes>
        {/* admin no puede entrar */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/info-practica" element={<InfoPractica />} />
          <Route path="/contacte" element={<Contacte />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset/:token" element={<ResetPassword />} />
        </Route>

        <Route path="/perfil" element={<Profile />} />

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
