import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No hem trobat cap compte amb aquest email.");
      } else {
        setError("Hi ha hagut un error. Torna-ho a intentar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#432918] mb-2 text-center">
          He oblidat la contrasenya
        </h1>

        {!success ? (
          <>
            <p className="text-sm text-gray-600 text-center mb-6">
              Introdueix el teu email i t'enviarem un enllaç per restablir la
              contrasenya.
            </p>

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
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#d7b731]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#461615] text-white font-bold py-2 rounded hover:bg-[#461615]/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Enviant..." : "Enviar enllaç"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
              T'hem enviat un email amb les instruccions per restablir la
              contrasenya.
            </div>
          </div>
        )}

        <p className="text-center text-sm mt-4 text-gray-600">
          <Link
            to="/login"
            className="text-[#ba5940] hover:underline font-medium"
          >
            Tornar a iniciar sessió
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
