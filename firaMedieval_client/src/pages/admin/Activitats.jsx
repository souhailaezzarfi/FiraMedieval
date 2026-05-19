import { useEffect, useState } from "react";
import activitatService from "../../services/activitatService";
import categoriaService from "../../services/categoriaService";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

const PER_PAGE = 10;

const EMPTY_HORARI = { hora_inici: "", hora_final: "" };
const EMPTY_FORM = {
  nom: "",
  organitzador: "",
  descripcio: "",
  ubicacio: "",
  aforament: "",
  imatge: null,
  eliminarImatge: false,
  categories: [],
  horaris: [{ ...EMPTY_HORARI }],
};

const extractTime = (dt) => {
  if (!dt) return "—";
  return dt.toString().slice(11, 16);
};
const formatDate = (dt) =>
  dt ? new Date(dt).toLocaleDateString("ca-ES") : "—";
const formatTime = (dt) =>
  dt
    ? new Date(dt).toLocaleTimeString("ca-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
const toDatetimeLocal = (dt) => {
  if (!dt) return "";
  const d = new Date(dt);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const FieldError = ({ msg }) =>
  msg ? <p className="text-red-600 text-xs mt-1">{msg}</p> : null;

export default function Activitats() {
  const [activitats, setActivitats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [repeteixDies, setRepeteixDies] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [resAct, resCat] = await Promise.all([
        activitatService.getAll(),
        categoriaService.getAll(),
      ]);
      setActivitats(resAct.data?.data ?? resAct.data ?? []);
      setCategories(resCat.data?.data ?? resCat.data ?? []);
    } catch {
      setError("No s'han pogut carregar les dades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = activitats.filter((a) => {
    const q = search.toLowerCase();
    return (
      (a.nom ?? "").toLowerCase().includes(q) ||
      (a.organitzador ?? "").toLowerCase().includes(q) ||
      (a.ubicacio ?? "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleCategoria = (nom) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(nom)
        ? f.categories.filter((c) => c !== nom)
        : [...f.categories, nom],
    }));
  };

  const afegirNovaCategoria = () => {
    const nom = novaCategoria.trim();
    if (!nom) return;
    if (!form.categories.includes(nom)) {
      setForm((f) => ({ ...f, categories: [...f.categories, nom] }));
    }
    setNovaCategoria("");
  };

  const addHorari = () =>
    setForm((f) => ({ ...f, horaris: [...f.horaris, { ...EMPTY_HORARI }] }));

  const removeHorari = (i) =>
    setForm((f) => ({
      ...f,
      horaris: f.horaris.filter((_, idx) => idx !== i),
    }));

  const updateHorari = (i, field, value) =>
    setForm((f) => ({
      ...f,
      horaris: f.horaris.map((h, idx) =>
        idx === i ? { ...h, [field]: value } : h,
      ),
    }));

  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setNovaCategoria("");
    setFieldErrors({});
    setShowModal(true);
    setRepeteixDies(false);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      nom: item.nom ?? "",
      organitzador: item.organitzador ?? "",
      descripcio: item.descripcio ?? "",
      ubicacio: item.ubicacio ?? "",
      aforament: item.aforament ?? "",
      imatge: null,
      eliminarImatge: false,
      categories: (item.categories ?? []).map((c) => c.nom ?? c),
      horaris:
        (item.horaris ?? []).length > 0
          ? item.horaris.map((h) => ({
              hora_inici: toDatetimeLocal(h.hora_inici),
              hora_final: toDatetimeLocal(h.hora_final),
            }))
          : [{ ...EMPTY_HORARI }],
    });
    setNovaCategoria("");
    setFieldErrors({});
    setShowModal(true);
    setRepeteixDies(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Segur que vols eliminar aquesta activitat?")) return;
    try {
      await activitatService.delete(id);
      setActivitats((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Error en eliminar l'activitat.");
    }
  };

  const handleSubmit = async () => {
    // Validació frontend amb errors per camp
    const errors = {};

    if (!form.nom) errors.nom = "El nom és obligatori.";
    if (!form.organitzador)
      errors.organitzador = "L'organitzador és obligatori.";
    if (!form.descripcio) errors.descripcio = "La descripció és obligatòria.";
    if (!form.ubicacio) errors.ubicacio = "La ubicació és obligatòria.";
    if (form.categories.length === 0)
      errors.categories = "Selecciona almenys una categoria.";
    if (form.horaris.some((h) => !h.hora_inici))
      errors.horaris = "Tots els horaris han de tenir hora d'inici.";
    if (form.imatge && form.imatge.size > 2 * 1024 * 1024)
      errors.imatge = "La imatge no pot pesar més de 2MB.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    let horarisToSend = form.horaris;

    if (repeteixDies) {
      const extra = [];
      form.horaris.forEach((h) => {
        [1, 2].forEach((offset) => {
          const inici = new Date(h.hora_inici);
          inici.setDate(inici.getDate() + offset);
          const final = h.hora_final ? new Date(h.hora_final) : null;
          if (final) final.setDate(final.getDate() + offset);

          const pad = (n) => String(n).padStart(2, "0");
          const fmt = (d) =>
            `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

          extra.push({
            hora_inici: fmt(inici),
            hora_final: final ? fmt(final) : "",
          });
        });
      });
      horarisToSend = [...form.horaris, ...extra];
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("nom", form.nom);
      fd.append("organitzador", form.organitzador);
      fd.append("descripcio", form.descripcio);
      fd.append("ubicacio", form.ubicacio);
      if (form.aforament) fd.append("aforament", form.aforament);
      if (form.imatge) fd.append("imatge", form.imatge);
      if (form.eliminarImatge) fd.append("eliminar_imatge", "1");

      form.categories.forEach((c, i) => fd.append(`categories[${i}]`, c));
      horarisToSend.forEach((h, i) => {
        fd.append(`horaris[${i}][hora_inici]`, h.hora_inici);
        if (h.hora_final) fd.append(`horaris[${i}][hora_final]`, h.hora_final);
      });

      if (editItem) {
        await activitatService.update(editItem.id, fd);
      } else {
        await activitatService.create(fd);
      }
      setShowModal(false);
      load();
    } catch (err) {
      const laravelErrors = err.response?.data?.errors;
      if (laravelErrors) {
        const mapped = {};
        [
          "nom",
          "organitzador",
          "descripcio",
          "ubicacio",
          "aforament",
          "imatge",
          "categories",
        ].forEach((key) => {
          if (laravelErrors[key]) mapped[key] = laravelErrors[key][0];
        });
        // Horaris (poden venir com horaris.0.hora_inici, etc.)
        const horariError = Object.keys(laravelErrors).find((k) =>
          k.startsWith("horaris"),
        );
        if (horariError) mapped.horaris = laravelErrors[horariError][0];

        setFieldErrors(mapped);
      } else {
        setFieldErrors({
          general: err.response?.data?.message ?? "Error en desar l'activitat.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2C1A0E]">Activitats</h1>
            <p className="text-md text-[#8B6A4A] mt-1">
              {activitats.length} activitats en total
            </p>
          </div>
          <input
            type="text"
            placeholder="Cercar per nom, organitzador o ubicació..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg font-sans border border-[#C8B08A] bg-white text-md text-[#2C1A0E] outline-none focus:border-[#D4A853] w-90"
          />
        </div>
        <button
          onClick={openCreate}
          className="bg-[#D4A853] text-[#1E0F07] font-semibold text-lg px-5 py-2.5 rounded-lg hover:bg-[#C49743] transition-colors"
        >
          + Nova activitat
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
                  "Imatge",
                  "Nom",
                  "Organitzador",
                  "Descripció",
                  "Ubicació",
                  "Categories",
                  "Data",
                  "Horaris",
                  "Aforament",
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
              {paged.map((a) => (
                <tr
                  key={a.id}
                  className="border-t border-[#EDE3CF] hover:bg-[#FAF6EE] transition-colors"
                >
                  <td className="px-4 py-3">
                    {a.imatge ? (
                      <img
                        src={a.imatge}
                        alt={a.nom}
                        className="w-14 h-10 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-14 h-10 bg-[#EDE3CF] rounded-md flex items-center justify-center text-lg">
                        ?
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[#432918]">
                    {a.nom}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B4F30]">
                    {a.organitzador ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B4F30]">
                    {a.descripcio ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B4F30]">
                    {a.ubicacio ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(a.categories ?? []).map((c) => (
                        <span
                          key={c.id ?? c}
                          className="bg-[#EDE3CF] text-[#6B4F30] text-sm px-2 py-0.5 rounded-full"
                        >
                          {c.nom ?? c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#432918]">
                    <div className="flex flex-col gap-0.5">
                      {(a.horaris ?? []).length > 0
                        ? [
                            ...new Map(
                              (a.horaris ?? []).map((h) => [
                                formatDate(h.hora_inici),
                                h,
                              ]),
                            ).values(),
                          ].map((h, i) => (
                            <span key={i} className="whitespace-nowrap">
                              {formatDate(h.hora_inici)}
                            </span>
                          ))
                        : "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      {[
                        ...new Map(
                          (a.horaris ?? []).map((h) => [
                            `${extractTime(h.hora_inici)}-${extractTime(h.hora_final)}`,
                            h,
                          ]),
                        ).values(),
                      ].map((h, i) => (
                        <span
                          key={i}
                          className="text-sm text-[#6B4F30] whitespace-nowrap"
                        >
                          {extractTime(h.hora_inici)}
                          {h.hora_final
                            ? ` - ${extractTime(h.hora_final)}`
                            : ""}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-[#432918]">
                    {a.aforament ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
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
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center text-[#8B6A4A] py-16 text-sm"
                  >
                    No hi ha activitats
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FBF7F0] rounded-xl w-full max-w-2xl border border-[#E0D5C0] max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-6 border-b border-[#E0D5C0]">
              <h2 className="text-2xl font-bold text-[#2C1A0E]">
                {editItem ? "Editar activitat" : "Nova activitat"}
              </h2>
            </div>

            <div className="px-8 py-6 space-y-4">
              {/* Error general (500, xarxa) */}
              {fieldErrors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
                  {fieldErrors.general}
                </div>
              )}

              {/* Nom, organitzador, ubicacio */}
              {[
                { key: "nom", label: "Nom *", type: "text" },
                { key: "organitzador", label: "Organitzador *", type: "text" },
                { key: "ubicacio", label: "Ubicació *", type: "text" },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-lg font-medium text-[#6B4F30] mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, [key]: e.target.value }));
                      setFieldErrors((fe) => ({ ...fe, [key]: undefined }));
                    }}
                    className={`w-full px-3 py-2 rounded-lg font-sans border bg-white text-md text-[#2C1A0E] outline-none focus:border-[#D4A853] ${
                      fieldErrors[key] ? "border-red-400" : "border-[#C8B08A]"
                    }`}
                  />
                  <FieldError msg={fieldErrors[key]} />
                </div>
              ))}
            </div>

            {/* Descripció */}
            <div className="px-8 py-6 space-y-4">
              <label className="block text-lg font-medium text-[#6B4F30] mb-1">
                Descripció *
              </label>
              <textarea
                rows={3}
                value={form.descripcio}
                onChange={(e) => {
                  setForm((f) => ({ ...f, descripcio: e.target.value }));
                  setFieldErrors((fe) => ({ ...fe, descripcio: undefined }));
                }}
                className={`w-full px-3 py-2 rounded-lg font-sans border bg-white text-md text-[#2C1A0E] outline-none focus:border-[#D4A853] resize-none ${
                  fieldErrors.descripcio ? "border-red-400" : "border-[#C8B08A]"
                }`}
              />
              <FieldError msg={fieldErrors.descripcio} />
            </div>

            {/* Categories */}
            <div className="px-8 py-6 space-y-4">
              <label className="block text-lg font-medium text-[#6B4F30] mb-2">
                Categories *
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.map((c) => {
                  const nom = c.nom ?? c;
                  const selected = form.categories.includes(nom);
                  return (
                    <button
                      key={c.id ?? nom}
                      type="button"
                      onClick={() => {
                        toggleCategoria(nom);
                        setFieldErrors((fe) => ({
                          ...fe,
                          categories: undefined,
                        }));
                      }}
                      className={`text-md px-3 py-1.5 rounded-full border transition-colors ${
                        selected
                          ? "bg-[#D4A853] border-[#D4A853] text-[#1E0F07] font-semibold"
                          : "bg-white border-[#C8B08A] text-[#6B4F30] hover:bg-[#EDE3CF]"
                      }`}
                    >
                      {selected ? "✓ " : ""}
                      {nom}
                    </button>
                  );
                })}
              </div>
              {/* Nova categoria */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nova categoria..."
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && afegirNovaCategoria()}
                  className="flex-1 px-3 py-1.5 rounded-lg font-sans border border-[#C8B08A] bg-white text-sm text-[#2C1A0E] outline-none focus:border-[#D4A853]"
                />
                <button
                  type="button"
                  onClick={afegirNovaCategoria}
                  className="bg-[#EDE3CF] text-[#6B4F30] text-md px-3 py-1.5 rounded-lg hover:bg-[#D4C9A8] transition-colors"
                >
                  Afegir
                </button>
              </div>
              {form.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.categories.map((c) => (
                    <span
                      key={c}
                      className="bg-[#D4A853]/20 text-[#854F0B] text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => toggleCategoria(c)}
                        className="hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <FieldError msg={fieldErrors.categories} />
            </div>

            {/* Horaris */}
            <div className="px-8 py-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-lg font-medium text-[#6B4F30]">
                  Horaris *
                </label>
                <button
                  type="button"
                  onClick={addHorari}
                  className="text-md text-[#92712e] hover:text-[#C49743] font-medium"
                >
                  + Afegir horari
                </button>
              </div>
              <div className="space-y-2">
                {form.horaris.map((h, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <label className="text-md text-[#8B6A4A] mb-0.5 block">
                        Inici *
                      </label>
                      <input
                        type="datetime-local"
                        value={h.hora_inici}
                        onChange={(e) => {
                          updateHorari(i, "hora_inici", e.target.value);
                          setFieldErrors((fe) => ({
                            ...fe,
                            horaris: undefined,
                          }));
                        }}
                        className="w-full px-3 py-1.5 rounded-lg font-sans border border-[#C8B08A] bg-white text-sm text-[#2C1A0E] outline-none focus:border-[#D4A853]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-md text-[#8B6A4A] mb-0.5 block">
                        Final
                      </label>
                      <input
                        type="datetime-local"
                        value={h.hora_final}
                        onChange={(e) =>
                          updateHorari(i, "hora_final", e.target.value)
                        }
                        className="w-full px-3 py-1.5 rounded-lg font-sans border border-[#C8B08A] bg-white text-sm text-[#2C1A0E] outline-none focus:border-[#D4A853]"
                      />
                    </div>
                    {form.horaris.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHorari(i)}
                        className="mt-4 text-red-400 hover:text-red-600 text-xl leading-none"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <FieldError msg={fieldErrors.horaris} />
            </div>

            {/* Aforament */}
            <div className="px-8 py-6 space-y-4">
              <label className="block text-lg font-medium text-[#6B4F30] mb-1">
                Aforament
              </label>
              <input
                type="text"
                value={form.aforament}
                onChange={(e) => {
                  setForm((f) => ({ ...f, aforament: e.target.value }));
                  setFieldErrors((fe) => ({ ...fe, aforament: undefined }));
                }}
                className={`w-full px-3 py-2 rounded-lg font-sans border bg-white text-md text-[#2C1A0E] outline-none focus:border-[#D4A853] ${
                  fieldErrors.aforament ? "border-red-400" : "border-[#C8B08A]"
                }`}
              />
              <FieldError msg={fieldErrors.aforament} />
            </div>

            {/* Imatge */}
            <div className="px-8 py-6 space-y-4">
              <label className="block text-lg font-medium text-[#6B4F30] mb-1">
                Imatge
              </label>
              {editItem?.imatge && !form.eliminarImatge && (
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={editItem.imatge}
                    alt="actual"
                    className="w-20 h-14 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        eliminarImatge: true,
                        imatge: null,
                      }))
                    }
                    className="text-md text-red-500 hover:text-red-700"
                  >
                    Eliminar imatge
                  </button>
                </div>
              )}
              {form.eliminarImatge && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-md text-red-500">
                    La imatge s'eliminarà en desar.
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, eliminarImatge: false }))
                    }
                    className="text-md text-[#6B4F30] underline"
                  >
                    Cancel·lar
                  </button>
                </div>
              )}
              {!form.eliminarImatge && (
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => {
                    setForm((f) => ({
                      ...f,
                      imatge: e.target.files[0] ?? null,
                    }));
                    setFieldErrors((fe) => ({ ...fe, imatge: undefined }));
                  }}
                  className="w-full text-sm font-sans text-[#2C1A0E]"
                />
              )}
              <FieldError msg={fieldErrors.imatge} />
            </div>

            {/* Footer modal */}
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
