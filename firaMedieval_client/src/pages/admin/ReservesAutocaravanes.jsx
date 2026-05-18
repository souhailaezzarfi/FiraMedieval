import { useEffect, useState } from "react";
import reservaService from "../../services/reservaAutocaravanaService";
import { MdDelete } from "react-icons/md";

const PER_PAGE = 8;

export default function Reserves() {
  const [reserves, setReserves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await reservaService.getAll();
      setReserves(res.data ?? []);
    } catch {
      setError("No s'han pogut carregar les reserves.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = reserves.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.matricula ?? "").toLowerCase().includes(q) ||
      (r.marca_vehicle ?? "").toLowerCase().includes(q) ||
      (r.usuari?.nom ?? "").toLowerCase().includes(q) ||
      (r.usuari?.email ?? "").toLowerCase().includes(q) ||
      (r.estat ?? "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCancel = async (id) => {
    if (!window.confirm("Segur que vols cancel·lar aquesta reserva?")) return;
    try {
      await reservaService.delete(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message ?? "Error en cancel·lar la reserva.");
    }
  };

  const estatBadge = (estat) => {
    if (estat === "confirmada")
      return (
        <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
          Confirmada
        </span>
      );
    if (estat === "espera")
      return (
        <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
          Espera
        </span>
      );
    return (
      <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-[#EDE3CF] text-[#6B4F30]">
        Cancel·lada
      </span>
    );
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("ca-ES") : "—");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-15">
          <div>
            <h1 className="text-2xl font-bold text-[#2C1A0E]">Reserves</h1>
            <p className="text-lg text-[#8B6A4A] mt-1">
              {filtered.length} reserves registrades
            </p>
          </div>

          <input
            type="text"
            placeholder="Cercar per matrícula, usuari, estat..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg font-sans border border-[#C8B08A] bg-white text-md text-[#2C1A0E] outline-none focus:border-[#D4A853] w-90"
          />
        </div>
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
                  "Vehicle",
                  "Matrícula",
                  "Persones",
                  "Arribada",
                  "Sortida",
                  "Estat",
                  "Accions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-lg font-semibold text-[#6B4F30] uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-[#EDE3CF] hover:bg-[#FAF6EE] transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-sans font-medium text-[#432918]">
                      {r.usuari?.nom} {r.usuari?.cognoms}
                    </p>
                    <p className="text-xs font-sans text-[#8B6A4A]">{r.usuari?.email}</p>
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-[#6B4F30]">
                    {r.marca_vehicle} {r.model_vehicle}
                  </td>
                  <td className="px-4 py-3 text-sm font-sans text-[#6B4F30]">
                    {r.matricula}
                  </td>
                  <td className="px-4 py-3 text-sm font-sans text-[#6B4F30]">
                    {r.total_persones}
                  </td>
                  <td className="px-4 py-3 text-sm font-sans text-[#6B4F30]">
                    {formatDate(r.data_arribada)}
                  </td>
                  <td className="px-4 py-3 text-sm font-sans text-[#6B4F30]">
                    {formatDate(r.data_sortida)}
                  </td>
                  <td className="px-4 py-3 font-sans text-sm">{estatBadge(r.estat)}</td>
                  <td className="px-4 py-3">
                    {r.estat !== "cancel·lada" && (
                      <button
                        onClick={() => handleCancel(r.id)}
                        className="text-red-700 text-md font-sans px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <MdDelete size={22} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center font-sans text-[#8B6A4A] py-16 text-md"
                  >
                    No s'han trobat reserves
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

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
