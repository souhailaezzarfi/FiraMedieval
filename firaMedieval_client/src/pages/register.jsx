import { useState } from "react";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

export const registerSchema = z
  .object({
    nom: z.string().min(1, "El nom és obligatori"),
    cognoms: z.string().min(1, "Els cognoms són obligatoris"),
    email: z.string().email("El correu no és vàlid"),
    telefon: z.string().min(9, "El telèfon ha de tenir almenys 9 dígits"),
    password: z
      .string()
      .min(8, "La contrasenya ha de tenir almenys 8 caràcters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les contrasenyes no coincideixen",
    path: ["password_confirmation"],
  });

function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    cognoms: "",
    email: "",
    telefon: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [estatEnviament, setEstatEnviament] = useState("idle");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const netejarError = (e) => {
    const { name } = e.target;
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultatValidacio = registerSchema.safeParse(formData);

    if (!resultatValidacio.success) {
      const nousErrors = {};
      resultatValidacio.error.issues.forEach((issue) => {
        nousErrors[issue.path[0]] = issue.message;
      });
      setErrors(nousErrors);
      return;
    }

    setErrors({});
    setEstatEnviament("loading");

    try {
      const response = await authService.register(formData);
      localStorage.setItem("token", response.data.token);
      login(response.data.user);
      navigate(from ?? "/perfil", { replace: true });
    } catch (err) {
      if (err.response?.status === 422) {
        // Error de validació
        setErrors(
          "Les dades introduïdes no són vàlides o el correu ja existeix.",
        );
      } else {
        // Error de connexió
        setErrors("Hi ha hagut un error en el registre. Torna-ho a intentar.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#432918] mb-6 text-center">
          Crear compte
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#432918] mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              onFocus={netejarError}
              disabled={estatEnviament !== "idle"}
              className={`w-full border rounded px-3 py-2 ${errors.nom ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.nom && <p className="text-red-500">{errors.nom}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#432918] mb-1">
              Cognoms <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="cognoms"
              value={formData.cognoms}
              onChange={handleChange}
              onFocus={netejarError}
              disabled={estatEnviament !== "idle"}
              className={`w-full border rounded px-3 py-2 ${errors.cognoms ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.cognoms && <p className="text-red-500">{errors.cognoms}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#432918] mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={netejarError}
              disabled={estatEnviament !== "idle"}
              className={`w-full border rounded px-3 py-2 ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#432918] mb-1">
              Telèfon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              onFocus={netejarError}
              disabled={estatEnviament !== "idle"}
              className={`w-full border rounded px-3 py-2 ${errors.telefon ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.telefon && <p className="text-red-500">{errors.telefon}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#432918] mb-1">
              Contrasenya <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={netejarError}
              disabled={estatEnviament !== "idle"}
              className={`w-full border rounded px-3 py-2 ${errors.password ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#432918] mb-1">
              Confirmar contrasenya <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              onFocus={netejarError}
              disabled={estatEnviament !== "idle"}
              className={`w-full border rounded px-3 py-2 ${errors.password_confirmation ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.password_confirmation && (
              <p className="text-red-500">{errors.password_confirmation}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#461615] text-white font-bold py-2 rounded hover:bg-[#461615]/90 transition-colors"
          >
            Crear compte
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Ja tens compte?{" "}
          <Link
            to="/login"
            state={{ from }}
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
