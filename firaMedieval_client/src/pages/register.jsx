import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    cognoms: "",
    email: "",
    telefon: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await authService.register(formData);
      localStorage.setItem("token", response.data.token);
      login(response.data.user);
      navigate("/");
    } catch (err) {
      setError("Hi ha hagut un error. Comprova les dades.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#432918] mb-6 text-center">
          Crear compte
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#432918] mb-1">
              Nom
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#d7b731]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#432918] mb-1">
              Cognoms
            </label>
            <input
              type="text"
              name="cognoms"
              value={formData.cognoms}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#d7b731]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#432918] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#d7b731]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#432918] mb-1">
              Telèfon
            </label>
            <input
              type="tel"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#d7b731]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#432918] mb-1">
              Contrasenya
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#d7b731]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#432918] mb-1">
              Confirmar contrasenya
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#d7b731]"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[#d7b731] text-white font-bold py-2 rounded hover:bg-[#ba5940] transition-colors"
          >
            Crear compte
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Ja tens compte?{" "}
          <Link
            to="/login"
            className="text-[#ba5940] hover:underline font-medium"
          >
            Inicia sessió
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
