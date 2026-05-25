import { MdClose, MdDelete } from "react-icons/md";
import { useState } from "react";

const ESTAT = {
  confirmada: { label: "Confirmada", classes: "bg-green-100 text-green-800" },
  espera: { label: "En espera", classes: "bg-yellow-100 text-yellow-800" },
  "cancel·lada": { label: "Cancel·lada", classes: "bg-red-100 text-red-700" },
};

const formatDia = (dt) => {
  if (!dt) return "—";
  const d = new Date(dt.replace(" ", "T"));
  const dia = d.toLocaleDateString("ca-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return dia.charAt(0).toUpperCase() + dia.slice(1);
};

const formatHora = (dt) => {
  if (!dt) return "";
  return new Date(dt.replace(" ", "T")).toLocaleTimeString("ca-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function InscritsModal({
  activitat,
  inscrits,
  loading,
  onCancel,
  onDeleteCancelades,
  onClose,
}) {
  const [filterEstat, setFilterEstat] = useState("");
  const [filterHorari, setFilterHorari] = useState("");

  const comptadorPerFranja = inscrits.reduce((acc, i) => {
    if (i.estat === "confirmada") {
      acc[i.horari_id] = (acc[i.horari_id] ?? 0) + 1;
    }
    return acc;
  }, {});

  const totalConfirmats = inscrits.filter(
    (i) => i.estat === "confirmada",
  ).length;
  const totalEspera = inscrits.filter((i) => i.estat === "espera").length;
  const aforamentTotal = activitat.aforament
    ? activitat.aforament * (activitat.horaris?.length ?? 1)
    : null;

  const filtered = inscrits.filter((i) => {
    const matchEstat = filterEstat ? i.estat === filterEstat : true;
    const matchHorari = filterHorari ? i.horari_id == filterHorari : true;
    return matchEstat && matchHorari;
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#FBF7F0] rounded-2xl w-[75vw] border border-[#E0D5C0] h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#E0D5C0] flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-[#2C1A0E]">
              Inscrits — {activitat.nom}
            </h2>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              {aforamentTotal && (
                <span className="text-md font-semibold text-[#6B4F30]">
                  Total: {totalConfirmats} / {aforamentTotal} places
                </span>
              )}
              {totalEspera > 0 && (
                <span className="text-md text-yellow-700 font-medium bg-yellow-50 border border-yellow-200 px-2.5 py-0.5 rounded-full">
                  {totalEspera} en espera
                </span>
              )}
              {activitat.horaris?.map((h) => (
                <span
                  key={h.id}
                  className="text-md text-[#8B6A4A] bg-[#EDE3CF] px-2.5 py-0.5 rounded-full"
                >
                  {formatDia(h.hora_inici)} {formatHora(h.hora_inici)}h:&nbsp;
                  <span className="font-semibold text-[#432918]">
                    {comptadorPerFranja[h.id] ?? 0}/{activitat.aforament ?? 0}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8B6A4A] hover:text-[#2C1A0E] transition-colors mt-1 shrink-0"
          >
            <MdClose size={26} />
          </button>
        </div>

        {/* Filtres */}
        <div className="px-8 py-3 border-b border-[#E0D5C0] flex items-center gap-4 shrink-0 bg-[#FAF6EE]">
          <span className="text-md font-semibold text-[#8B6A4A] uppercase tracking-wider">
            Filtrar per:
          </span>

          <select
            value={filterHorari}
            onChange={(e) => setFilterHorari(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#C8B08A] bg-white text-md text-[#2C1A0E] outline-none focus:border-[#D4A853]"
          >
            <option value="">Tots els dies i hores</option>
            {activitat.horaris?.map((h) => (
              <option key={h.id} value={h.id}>
                {formatDia(h.hora_inici)} — {formatHora(h.hora_inici)}h
                {h.hora_final ? ` - ${formatHora(h.hora_final)}h` : ""}
              </option>
            ))}
          </select>

          <select
            value={filterEstat}
            onChange={(e) => setFilterEstat(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#C8B08A] bg-white text-md text-[#2C1A0E] outline-none focus:border-[#D4A853]"
          >
            <option value="">Tots els estats</option>
            <option value="confirmada">Confirmada</option>
            <option value="espera">En espera</option>
            <option value="cancel·lada">Cancel·lada</option>
          </select>

          {(filterEstat || filterHorari) && (
            <button
              onClick={() => {
                setFilterEstat("");
                setFilterHorari("");
              }}
              className="text-md text-[#8B6A4A] hover:text-red-600 underline transition-colors"
            >
              Netejar filtres
            </button>
          )}
          {inscrits.some((i) => i.estat === "cancel·lada") && (
            <button
              onClick={onDeleteCancelades}
              className="text-sm text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              Eliminar totes les cancel·lades
            </button>
          )}

          <span className="ml-auto text-md text-[#8B6A4A]">
            {filtered.length} resultat{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Body */}
        <div className="overflow-y-auto overflow-x-auto flex-1">
          {loading ? (
            <p className="text-center text-[#8B6A4A] py-16">Carregant...</p>
          ) : inscrits.length === 0 ? (
            <p className="text-center text-[#8B6A4A] py-16 text-lg">
              No hi ha inscripcions per aquesta activitat.
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-[#8B6A4A] py-16 text-lg">
              No hi ha inscripcions amb aquests filtres.
            </p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#EDE3CF] sticky top-0">
                  {[
                    "Usuari",
                    "Email",
                    "Dia",
                    "Franja horària",
                    "Estat",
                    "Data inscripció",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-lg font-semibold text-[#6B4F30] uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-sans">
                {filtered.map((i) => {
                  const cfg = ESTAT[i.estat] ?? {
                    label: i.estat,
                    classes: "bg-gray-100 text-gray-700",
                  };
                  const horaInici = i.horari?.hora_inici;
                  const horaFinal = i.horari?.hora_final;
                  return (
                    <tr
                      key={i.id}
                      className="border-t border-[#EDE3CF] hover:bg-[#FAF6EE] transition-colors"
                    >
                      <td className="px-5 py-3 text-sm font-medium text-[#432918] whitespace-nowrap">
                        {i.user?.name ?? i.user?.nom ?? `#${i.user_id}`}{" "}
                        {i.user?.cognoms ?? ""}
                      </td>
                      <td className="px-5 py-3 text-sm text-[#6B4F30]">
                        {i.user?.email ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-sm text-[#432918] whitespace-nowrap">
                        {horaInici ? formatDia(horaInici) : "—"}
                      </td>
                      <td className="px-5 py-3 text-sm text-[#6B4F30] whitespace-nowrap">
                        {horaInici
                          ? `${formatHora(horaInici)}h${horaFinal ? ` – ${formatHora(horaFinal)}h` : ""}`
                          : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.classes}`}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-[#8B6A4A] whitespace-nowrap">
                        {i.created_at
                          ? new Date(i.created_at).toLocaleDateString("ca-ES")
                          : "—"}
                      </td>
                      <td className="px-5 py-3">
                        {i.estat !== "cancel·lada" ? (
                          <button
                            onClick={() => onCancel(i.id)}
                            className="text-red-600 hover:bg-red-100 p-1.5 rounded-md transition-colors"
                            title="Cancel·lar inscripció"
                          >
                            <MdDelete size={22} />
                          </button>
                        ) : (
                          <button
                            onClick={() => onCancel(i.id)}
                            className="text-red-300 hover:bg-red-50 hover:text-red-500 p-1.5 rounded-md transition-colors"
                            title="Eliminar definitivament"
                          >
                            <MdDelete size={22} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
