import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Activitats from "./pages/Activitats";
import InfoPractica from "./pages/InfoPractica";
import Contacte from "./pages/Contacte";
import Login from "./pages/Login";
import Register from "./pages/register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen flex flex-col bg-[#e1d7bc]">
        <Navbar />

        <main className="grow pt-18">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/activitats" element={<Activitats />} />
            <Route path="/info-practica" element={<InfoPractica />} />
            <Route path="/contacte" element={<Contacte />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/password-reset/:token" element={<ResetPassword />} />
            <Route path="/perfil" element={<Profile />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
