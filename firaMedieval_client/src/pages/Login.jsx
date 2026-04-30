import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Si us plau, omple tots els camps.");
      return;
    }
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem("token", response.data.token);
      login(response.data.user);

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/perfil");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Correu electrònic o contrasenya incorrectes.");
      } else {
        setError("Error de connexió. Torna-ho a intentar més tard.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#432918] mb-6 text-center">
          Iniciar sessió
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#432918] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none ${error ? "border-red-500" : "border-gray-300"}`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#432918] mb-1 ">
              Contrasenya
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none ${error ? "border-red-500" : "border-gray-300"}`}
              required
            />
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-[#ba5940] hover:underline"
            >
              He oblidat la contrasenya
            </Link>
          </div>

          <button
            type="submit"
            className="bg-[#461615] text-white font-bold py-2 rounded hover:bg-[#461615]/90 transition-colors"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Encara no tens compte?{" "}
          <Link
            to="/register"
            className="text-[#ba5940] hover:underline font-medium"
          >
            Registra't
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
