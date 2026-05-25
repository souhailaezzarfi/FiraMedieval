import { useEffect, useState } from "react";
import aparcamentService from "../../services/aparcamentService";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

export default function Aparcaments() {
  const [aparcaments, setAparcaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const EMPTY_FORM = {
    nom: "",
    aforament: "",
    data_inici: "",
    data_final: "",
  };

  const [form, setForm] = useState(EMPTY_FORM);

  const load = async () => {
    try {
      setLoading(true);
      const res = await aparcamentService.getAll();
      setAparcaments(res.data ?? []);
    } catch {
      setError("No s'han pogut carregar els aparcaments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Segur que vols eliminar aquest aparcament?")) return;
    try {
      await aparcamentService.delete(id);
      setAparcaments((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Error en eliminar l'aparcament.");
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (aparcament) => {
    setEditing(aparcament);
    setForm({
      nom: aparcament.nom,
      aforament: aparcament.aforament,
      data_inici: aparcament.data_inici,
      data_final: aparcament.data_final,
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!form.nom || !form.aforament || !form.data_inici || !form.data_final) {
      setFormError("Omple tots els camps obligatoris.");
      return;
    }

    if (new Date(form.data_final) <= new Date(form.data_inici)) {
      setFormError("La data final ha de ser posterior a la data d'inici.");
      return;
    }

    setSaving(true);

    try {
      if (editing) {
        await aparcamentService.update(editing.id, form);
      } else {
        await aparcamentService.create(form);
      }
      setShowModal(false);
      setForm(EMPTY_FORM);
      setEditing(null);
      load();
    } catch (err) {
      setFormError(
        err.response?.data?.message ?? "Error en desar l'aparcament.",
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("ca-ES") : "—");

  const estatBadge = (a) => {
    const avui = new Date();
    const inici = new Date(a.data_inici);
    const final = new Date(a.data_final);
    final.setHours(23, 59, 59);
    if (avui < inici)
      return (
        <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
          Pendent
        </span>
      );
    if (avui > final)
      return (
        <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-[#EDE3CF] text-[#6B4F30]">
          Tancat
        </span>
      );
    return (
      <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
        Actiu
      </span>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1A0E]">Aparcaments</h1>
          <p className="text-lg text-[#8B6A4A] mt-1">
            {aparcaments.length} aparcaments registrats
          </p>
        </div>

        <button
          onClick={openCreate}
          className="bg-[#D4A853] text-[#1E0F07] font-semibold text-md px-5 py-2.5 rounded-lg hover:bg-[#C49743] transition-colors"
        >
          + Nou aparcament
        </button>
      </div>

      {/* Taula */}
      <div className="bg-white rounded-xl border border-[#E0D5C0] overflow-hidden">
        {loading ? (
          <p className="text-center  text-[#8B6A4A] py-16">Carregant...</p>
        ) : error ? (
          <p className="text-center font-sans text-red-600 py-16">{error}</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#EDE3CF]">
                {[
                  "Nom",
                  "Aforament",
                  "Data inici",
                  "Data final",
                  "Estat",
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
            <tbody className="font-sans">
              {aparcaments.map((a) => (
                <tr
                  key={a.id}
                  className="border-t border-[#EDE3CF] hover:bg-[#FAF6EE] transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-[#432918]">
                    {a.nom}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B4F30]">
                    {a.aforament} places
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B4F30]">
                    {formatDate(a.data_inici)}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B4F30]">
                    {formatDate(a.data_final)}
                  </td>
                  <td className="px-4 py-3">{estatBadge(a)}</td>
                  <td className="px-4 py-3 flex items-center gap-1">
                    <button
                      onClick={() => openEdit(a)}
                      className="p-2 rounded-full text-[#6B4F30] hover:bg-[#EDE3CF] hover:text-[#432918] transition-all cursor-pointer"
                    >
                      <FaEdit size={22} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-2 rounded-full text-red-700 hover:bg-[#EDE3CF] hover:text-red-600 transition-all cursor-pointer"
                    >
                      <MdDelete size={22} />
                    </button>
                  </td>
                </tr>
              ))}
              {aparcaments.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-[#8B6A4A] py-16 text-sm"
                  >
                    No hi ha aparcaments registrats
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
          <div className="bg-[#FBF7F0] rounded-xl w-full max-w-lg border border-[#E0D5C0]">
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#E0D5C0]">
              <h2 className="text-2xl font-bold text-[#2C1A0E]">
                {editing ? "Editar aparcament" : "Nou aparcament"}
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
                {
                  key: "aforament",
                  label: "Aforament (places) *",
                  type: "number",
                },
                { key: "data_inici", label: "Data d'inici *", type: "date" },
                { key: "data_final", label: "Data final *", type: "date" },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-lg font-medium text-[#6B4F30] mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    min={type === "number" ? 1 : undefined}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
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
    </div>
  );
}
