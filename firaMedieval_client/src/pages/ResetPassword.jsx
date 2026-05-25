import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = window.location.pathname.split("/")[2];
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contrasenya ha de tenir mínim 8 caràcters.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Les contrasenyes no coincideixen.");
      return;
    }

    try {
      await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const primerError = Object.values(errors)[0][0];
        setError(primerError);
      } else {
        setError("Hi ha hagut un error. El token pot haver caducat.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#432918] mb-6 text-center">
          Restablir contrasenya
        </h1>

        {success ? (
          <div className="bg-green-100 text-green-700 p-4 rounded text-center">
            Contrasenya canviada correctament. Et redirigim al login...
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[#432918] mb-1">
                  Nova contrasenya
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#d7b731]"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-[#461615] text-white font-bold py-2 rounded hover:bg-[#461615]/90 transition-colors"
              >
                Canviar contrasenya
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm mt-4">
          <Link to="/login" className="text-[#ba5940] hover:underline">
            Tornar al login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
