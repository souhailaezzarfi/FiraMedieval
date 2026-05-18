import { useEffect, useState } from "react";
import userService from "../../services/userService";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

const PER_PAGE = 8;

export default function Usuaris() {
  const [usuaris, setUsuaris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const EMPTY_FORM = {
    nom: "",
    cognoms: "",
    telefon: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const [form, setForm] = useState(EMPTY_FORM);

  const load = async () => {
    try {
      setLoading(true);
      const res = await userService.getAll();
      setUsuaris(res.data?.data ?? res.data ?? []);
    } catch {
      setError("No s'han pogut carregar els usuaris.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = usuaris.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name ?? u.nom ?? "").toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.role ?? "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = async (id) => {
    if (!window.confirm("Segur que vols eliminar aquest usuari?")) return;
    try {
      await userService.deleteProfile(id);
      setUsuaris((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Error en eliminar l'usuari.");
    }
  };

  const initials = (u) =>
    (u.name ?? u.nom ?? "?")
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };
  const handleSubmit = async () => {
    setFormError(null);

    if (
      !form.nom ||
      !form.cognoms ||
      !form.telefon ||
      !form.email ||
      !form.password ||
      !form.password_confirmation
    ) {
      setFormError("Omple tots els camps obligatoris.");
      return;
    }

    setSaving(true);

    try {
      await userService.create(form);

      setShowModal(false);
      setForm(EMPTY_FORM);

      load();
    } catch (err) {
      const msg =
        err.response?.data?.message ?? "Error en crear l'administrador.";

      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-15">
          <div>
            <h1 className="text-2xl font-bold text-[#2C1A0E]">Usuaris</h1>

            <p className="text-lg text-[#8B6A4A] mt-1">
              {filtered.length} usuaris registrats
            </p>
          </div>

          <input
            type="text"
            placeholder="Cercar per nom, email o rol..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg border border-[#C8B08A] bg-white text-lg text-[#2C1A0E] outline-none focus:border-[#D4A853] w-60"
          />
        </div>

        <button
          onClick={openCreate}
          className="bg-[#D4A853] text-[#1E0F07] font-semibold text-md px-5 py-2.5 rounded-lg hover:bg-[#C49743] transition-colors"
        >
          + Nou admin
        </button>
      </div>

      {/* Taula */}
      <div className="bg-white rounded-xl border border-[#E0D5C0] overflow-hidden">
        {loading ? (
          <p className="text-center text-[#8B6A4A] py-16">Carregant...</p>
        ) : error ? (
          <p className="text-center text-red-600 py-16">{error}</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#EDE3CF]">
                {[
                  "Usuari",
                  "Email",
                  "Telèfon",
                  "Rol",
                  "Registrat",
                  "Accions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-md font-semibold text-[#6B4F30] uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-sans ">
              {paged.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-[#EDE3CF] hover:bg-[#FAF6EE] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#EDE3CF] flex items-center justify-center text-sm font-semibold text-[#6B4F30] shrink-0">
                        {initials(u)}
                      </div>
                      <span className="text-sm font-medium text-[#432918]">
                        {u.name ?? u.nom} {u.cognoms}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B4F30]">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B4F30]">
                    {u.telefon}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${
                        u.role === "admin"
                          ? "bg-[#D4A853]/20 text-[#854F0B]"
                          : "bg-[#EDE3CF] text-[#6B4F30]"
                      }`}
                    >
                      {u.role ?? "usuari"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#8B6A4A]">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString("ca-ES")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className=" text-red-700 text-sm px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <MdDelete size={22} />
                    </button>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-[#8B6A4A] py-16 text-sm"
                  >
                    No s'han trobat usuaris
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FBF7F0] rounded-xl w-full max-w-2xl border border-[#E0D5C0] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#E0D5C0]">
              <h2 className="text-2xl font-bold text-[#2C1A0E]">
                Nou administrador
              </h2>
            </div>

            {/* Body */}
            <div className="px-8 py-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
                  {formError}
                </div>
              )}

              {[
                { key: "nom", label: "Nom *", type: "text" },
                { key: "cognoms", label: "Cognoms *", type: "text" },
                { key: "telefon", label: "Telèfon *", type: "text" },
                { key: "email", label: "Email *", type: "email" },
                { key: "password", label: "Contrasenya *", type: "password" },
                {
                  key: "password_confirmation",
                  label: "Confirmar contrasenya *",
                  type: "password",
                },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-lg font-medium text-[#6B4F30] mb-1">
                    {label}
                  </label>

                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        [key]: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg font-sans border border-[#C8B08A] bg-white text-md text-[#2C1A0E] outline-none focus:border-[#D4A853]"
                  />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-[#E0D5C0] flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="border border-[#C8B08A] text-[#6B4F30] text-md px-5 py-2 rounded-lg hover:bg-[#EDE3CF] transition-colors"
              >
                Cancel·lar
              </button>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-[#D4A853] text-[#1E0F07] font-semibold text-md px-5 py-2 rounded-lg hover:bg-[#C49743] transition-colors disabled:opacity-60"
              >
                {saving ? "Desant..." : "Desar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paginació */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg border text-sm transition-colors ${
                p === page
                  ? "bg-[#D4A853] border-[#D4A853] text-[#1E0F07] font-semibold"
                  : "bg-white border-[#C8B08A] text-[#6B4F30] hover:bg-[#EDE3CF]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
