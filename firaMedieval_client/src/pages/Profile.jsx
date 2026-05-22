import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import reservaService from "../services/reservaAutocaravanaService";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const formatarDataCurta = (dataString) => {
  if (!dataString) return "";
  const dataObj = new Date(dataString.replace(" ", "T"));
  const diaSetmana = dataObj.toLocaleDateString("ca-ES", { weekday: "long" });
  const diaSetmanaCap =
    diaSetmana.charAt(0).toUpperCase() + diaSetmana.slice(1);
  const dia = String(dataObj.getDate()).padStart(2, "0");
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
  return `${diaSetmanaCap} ${dia}/${mes}`;
};

const formatarHora = (dataString) => {
  if (!dataString) return "";
  const dataObj = new Date(dataString.replace(" ", "T"));
  return dataObj.toLocaleTimeString("ca-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    cognoms: "",
    telefon: "",
    email: "",
  });
  const [saved, setSaved] = useState(false);

  const [reserva, setReserva] = useState(null);
  const [loadingReserva, setLoadingReserva] = useState(true);
  const [cancelant, setCancelant] = useState(false);

  const [inscripcions, setInscripcions] = useState([]);
  const [loadingInscripcions, setLoadingInscripcions] = useState(true);

  const [showEditReserva, setShowEditReserva] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [savingReserva, setSavingReserva] = useState(false);
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || "",
        cognoms: user.cognoms || "",
        telefon: user.telefon || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.role === "admin") return;
    setLoadingReserva(true);
    reservaService
      .getAll()
      .then((res) => {
        const reserves = res.data ?? [];
        const activa = reserves.find((r) => r.estat !== "cancel·lada");
        setReserva(activa ?? null);
      })
      .catch(() => setReserva(null))
      .finally(() => setLoadingReserva(false));
  }, [user]);

  useEffect(() => {
    if (!user || user.role === "admin") return;
    const fetchInscripcions = async () => {
      try {
        setLoadingInscripcions(true);
        const response = await api.get("/inscripcions");
        setInscripcions(response.data ?? []);
      } catch (err) {
        console.error("Error carregant les inscripcions:", err);
      } finally {
        setLoadingInscripcions(false);
      }
    };
    fetchInscripcions();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await userService.updateProfile(user.id, formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Estàs segur que vols eliminar el teu compte? Aquesta acció no es pot desfer.",
    );
    if (!confirmDelete) return false;
    try {
      await userService.deleteProfile(user.id);
      return true;
    } catch (err) {
      alert("No s'ha pogut eliminar el compte.");
      return false;
    }
  };

  const handleCancelReserva = async () => {
    if (!window.confirm("Segur que vols cancel·lar la teva reserva?")) return;
    setCancelant(true);
    try {
      await reservaService.delete(reserva.id);
      setReserva(null);
    } catch (err) {
      alert(err.response?.data?.message ?? "Error en cancel·lar la reserva.");
    } finally {
      setCancelant(false);
    }
  };

  const handleEliminarInscripcio = async (idInscripcio) => {
    if (
      !window.confirm(
        "Segur que vols cancel·lar la inscripció a aquesta activitat?",
      )
    )
      return;
    try {
      await api.delete(`/inscripcions/${idInscripcio}`);
      setInscripcions((prev) => prev.filter((ins) => ins.id !== idInscripcio));
    } catch (err) {
      console.error("Error en eliminar la inscripció:", err);
      alert("No s'ha pogut cancel·lar la inscripció.");
    }
  };

  const openEditReserva = () => {
    setEditForm({
      marca_vehicle: reserva.marca_vehicle,
      model_vehicle: reserva.model_vehicle,
      matricula: reserva.matricula,
      procedencia: reserva.procedencia,
      total_persones: reserva.total_persones,
      data_arribada: reserva.data_arribada,
      data_sortida: reserva.data_sortida,
    });
    setEditError(null);
    setShowEditReserva(true);
  };

  const handleSaveReserva = async () => {
    setEditError(null);

    if (new Date(editForm.data_sortida) <= new Date(editForm.data_arribada)) {
      setEditError("La data de sortida ha de ser posterior a la d'arribada.");
      return;
    }

    setSavingReserva(true);
    try {
      const res = await reservaService.update(reserva.id, editForm);
      setReserva(res.data);
      setShowEditReserva(false);
    } catch (err) {
      setEditError(err.response?.data?.message ?? "Error en desar els canvis.");
    } finally {
      setSavingReserva(false);
    }
  };

  const estatBadge = (estat) => {
    if (estat === "confirmada" || [...estat].join("").includes("acceptada"))
      return (
        <div className="bg-green-100 text-green-800 border border-green-200 font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-3 shrink-0 text-sm h-11 flex-1 sm:flex-none">
          <span className="material-symbols-outlined text-[18px]">
            &#xe86c;
          </span>
          Inscripció acceptada
        </div>
      );
    if (estat === "espera")
      return (
        <div className="bg-blue-100 text-blue-800 border border-blue-200 font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-3 shrink-0 text-sm h-11 flex-1 sm:flex-none">
          <span className="material-symbols-outlined text-[18px]">
            &#xe192;
          </span>
          En llista d'espera
        </div>
      );
    return (
      <div className="bg-red-100 text-red-800 border border-red-200 font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-3 shrink-0 text-sm h-11 flex-1 sm:flex-none">
        <span className="material-symbols-outlined text-[18px]">&#xe5cd;</span>
        Cancel·lada
      </div>
    );
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("ca-ES") : "—");

  const initials = user
    ? `${user.nom?.charAt(0) || ""}${user.cognoms?.charAt(0) || ""}`.toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-[#f7f2e8] text-[#432918] pb-12">
      <div
        className="relative h-40 sm:h-64 flex items-end w-full"
        style={{
          background:
            "linear-gradient(135deg, #ba5940 0%, #8b4513 40%, #d7b731 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)`,
            backgroundSize: "20px 20px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-4 sm:pb-6 w-full flex items-end gap-4 sm:gap-6 relative">
          <div
            className="w-18 h-18 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-2xl sm:text-4xl font-bold shadow-xl border-4 border-white shrink-0 font-serif tracking-[0.2em] pl-[0.2em]"
            style={{ background: "#432918", color: "#d7b731" }}
          >
            {initials}
          </div>
          <div className="pb-1 sm:pb-2 text-white min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs uppercase tracking-widest opacity-80 mb-0.5 font-bold">
              Perfil d'usuari
            </p>
            <h1 className="text-xl sm:text-4xl font-serif font-bold leading-tight drop-shadow-md truncate">
              {user?.nom} {user?.cognoms}
            </h1>
            <p className="text-xs sm:text-sm opacity-90 font-medium break-all truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12">
        <div className="bg-white/50 rounded-2xl border border-[#432918]/20 p-4 sm:p-10 space-y-10 sm:space-y-12 shadow-xs">
          {/* DADES PERFIL */}
          <div className="space-y-4 sm:space-y-5">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#432918] flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ba5940] text-2xl sm:text-3xl">
                &#xe853;
              </span>
              Dades personals
            </h2>
            <div className="border border-[#432918]/20 rounded-2xl p-4 sm:p-8 bg-white/50">
              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {[
                    { label: "Nom", key: "nom", type: "text" },
                    { label: "Cognoms", key: "cognoms", type: "text" },
                    { label: "Telèfon", key: "telefon", type: "tel" },
                    { label: "Correu electrònic", key: "email", type: "email" },
                  ].map(({ label, key, type }) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <label className="text-xs sm:text-sm font-bold text-[#432918]">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={formData[key]}
                        onChange={(e) =>
                          setFormData({ ...formData, [key]: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-[#432918]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ba5940] focus:border-transparent transition-all bg-[#fdfaf3] text-sm"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="bg-[#ba5940] hover:bg-[#432918] text-white font-bold py-3 px-6 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm cursor-pointer text-sm"
                  >
                    Desar canvis
                  </button>
                  {saved && (
                    <span className="text-xs sm:text-sm text-green-700 font-bold flex items-center justify-center gap-1.5 bg-green-100 px-3 py-1.5 rounded-lg border border-green-200">
                      <span className="material-symbols-outlined text-base">
                        &#xe5ca;
                      </span>
                      Desat correctament
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>

          {user?.role !== "admin" && (
            <>
              {/* RESERVA AUTOCARAVANES */}
              <div className="space-y-4 sm:space-y-5">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#432918] flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ba5940] text-2xl sm:text-3xl">
                    &#xe54f;
                  </span>
                  La meva reserva d'aparcament
                </h2>
                <div className="border border-[#432918]/20 rounded-2xl p-4 sm:p-8 bg-white/50">
                  <div className="space-y-4">
                    {loadingReserva ? (
                      <div className="w-full flex justify-center items-center py-4">
                        <svg
                          className="animate-spin h-6 w-6 text-[#ba5940]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    ) : reserva ? (
                      <div className="border border-[#432918]/20 p-4 rounded-2xl shadow-sm bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#ba5940]/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl sm:text-2xl text-[#ba5940]">
                              &#xeb3c;
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-base sm:text-lg text-[#432918] truncate">
                              {reserva.marca_vehicle} - {reserva.model_vehicle}
                            </p>
                            <p className="text-xs text-[#8b6a4a] mt-0.5 font-medium">
                              Matrícula: {reserva.matricula}
                            </p>
                            <p className="text-xs sm:text-sm text-[#432918]/80 mt-1 font-medium flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[15px] text-[#ba5940]">
                                &#xe192;
                              </span>
                              {formatDate(reserva.data_arribada)} -{" "}
                              {formatDate(reserva.data_sortida)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            {estatBadge(reserva.estat)}
                            <button
                              onClick={openEditReserva}
                              className="p-2 text-[#432918]/60 bg-[#fdfaf3] border border-[#432918]/20 rounded-xl hover:text-[#ba5940] hover:border-[#ba5940] transition-colors cursor-pointer flex items-center h-11 w-11 justify-center shrink-0"
                            >
                              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                                &#xe3c9;
                              </span>
                            </button>
                            <button
                              onClick={handleCancelReserva}
                              disabled={cancelant}
                              className="p-2 text-red-600/70 bg-red-50 border border-red-200 rounded-xl hover:text-red-700 hover:border-red-300 transition-colors cursor-pointer flex items-center h-11 w-11 justify-center shrink-0 disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                                &#xe872;
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-[#432918]/20">
                        <span className="material-symbols-outlined text-3xl text-[#432918]/20 mb-2 flex justify-center">
                          &#xe54f;
                        </span>
                        <p className="text-sm font-bold text-[#432918]/60">
                          No tens cap reserva d'aparcament activa.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* INSCRIPCIONS ACTIVITATS */}
              <div className="space-y-4 sm:space-y-5">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#432918] flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ba5940] text-2xl sm:text-3xl">
                    &#xe878;
                  </span>
                  Les meves inscripcions
                </h2>
                <div className="border border-[#432918]/20 rounded-2xl p-4 sm:p-8 bg-white/50">
                  <div className="space-y-4">
                    {loadingInscripcions ? (
                      <div className="w-full flex justify-center items-center py-4">
                        <svg
                          className="animate-spin h-6 w-6 text-[#ba5940]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    ) : inscripcions.length > 0 ? (
                      inscripcions.map((ins) => (
                        <div
                          key={ins.id}
                          className="border border-[#432918]/20 p-4 rounded-2xl shadow-sm bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ba5940]/10 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="material-symbols-outlined text-xl text-[#ba5940]">
                                &#xf3de;
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-sm sm:text-base text-[#432918] wrap-break-word">
                                {ins.activitat?.nom || "Activitat Medieval"}
                              </p>
                              <p className="text-xs sm:text-sm text-[#432918]/80 mt-1 font-medium flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[15px] text-[#ba5940]">
                                  &#xe192;
                                </span>
                                {ins.horari?.hora_inici
                                  ? `${formatarDataCurta(ins.horari.hora_inici)} • ${formatarHora(ins.horari.hora_inici)}`
                                  : "Sessió única"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-between sm:justify-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0 flex-1 sm:flex-none">
                            {estatBadge(ins.estat)}
                            <button
                              onClick={() => handleEliminarInscripcio(ins.id)}
                              className="p-2 text-red-600/70 bg-red-50 border border-red-200 rounded-xl hover:text-red-700 hover:border-red-300 transition-colors cursor-pointer flex items-center h-11 w-11 justify-center shrink-0"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                &#xe872;
                              </span>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-[#432918]/20">
                        <span className="material-symbols-outlined text-3xl text-[#432918]/20 mb-2">
                          &#xe876;
                        </span>
                        <p className="text-xs font-bold text-[#432918]/60">
                          No tens cap inscripció a activitats realitzada.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ELIMINAR COMPTE */}
          {user?.role !== "admin" && (
            <div className="space-y-5">
              <div className="border border-red-300 rounded-2xl p-4 sm:p-6 bg-red-50 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 shadow-2xs">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-200/60 flex items-center justify-center shrink-0 text-red-600/70">
                    <span className="material-symbols-outlined text-xl">
                      &#xe92b;
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-red-600/70">
                      Eliminar el meu compte
                    </p>
                    <p className="text-sm text-[#432918]/80 font-medium mt-1 leading-relaxed">
                      Aquesta acció no es pot revertir. S'eliminaran totes les
                      dades i reserves associades a aquest usuari.
                    </p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const deleted = await handleDelete();
                    if (deleted) {
                      logout();
                      navigate("/");
                    }
                  }}
                  className="bg-[#461615] hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md cursor-pointer w-full lg:w-auto text-center shrink-0 text-sm"
                >
                  Eliminar compte
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL EDICIÓ RESERVA */}
      {showEditReserva && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f7f2e8] rounded-3xl w-full max-w-lg border border-[#432918]/20 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 sm:px-8 py-5 border-b border-[#432918]/10 flex items-center justify-between sticky top-0 bg-[#f7f2e8] z-10">
              <h2 className="text-xl font-serif font-bold text-[#432918] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ba5940] text-2xl sm:text-3xl">
                  &#xe3c9;
                </span>
                Editar reserva
              </h2>
              <button
                onClick={() => setShowEditReserva(false)}
                className="text-[#432918]/40 hover:text-[#ba5940] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl sm:text-3xl">
                  &#xe5cd;
                </span>
              </button>
            </div>

            <div className="px-4 sm:px-8 py-5 sm:py-6 space-y-4 bg-white">
              {editError && (
                <div className="bg-[#ba5940]/10 border-l-4 border-[#ba5940] p-4 rounded-r-lg mt-2 mb-8 text-[#ba5940] font-bold text-xs sm:text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">
                    &#xe000;
                  </span>
                  {editError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "marca_vehicle", label: "Marca", type: "text" },
                  { key: "model_vehicle", label: "Model", type: "text" },
                ].map(({ key, label, type }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-bold text-[#432918]/80">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={editForm[key] ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-[#432918]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ba5940] bg-[#fdfaf3] text-sm"
                    />
                  </div>
                ))}
              </div>

              {[
                { key: "matricula", label: "Matrícula", type: "text" },
                { key: "procedencia", label: "Procedència", type: "text" },
                {
                  key: "total_persones",
                  label: "Total persones",
                  type: "number",
                },
              ].map(({ key, label, type }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-bold text-[#432918]/80">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={editForm[key] ?? ""}
                    min={type === "number" ? 1 : undefined}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="border border-[#432918]/20 rounded-xl px-3 sm:px-4 py-2 bg-[#fdfaf3] text-sm transition-all"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    key: "data_arribada",
                    label: "Data d'arribada",
                    type: "date",
                  },
                  {
                    key: "data_sortida",
                    label: "Data de sortida",
                    type: "date",
                  },
                ].map(({ key, label, type }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-bold text-[#432918]/80">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={editForm[key] ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                      className="border border-[#432918]/20 rounded-xl px-3 sm:px-4 py-2 bg-[#fdfaf3] text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 sm:px-8 py-4 border-t border-[#432918]/10 flex justify-end gap-3 sticky bottom-0 bg-[#f7f2e8] z-10">
              <button
                onClick={() => setShowEditReserva(false)}
                className="bg-white border border-[#432918]/20 text-[#432918] px-5 py-2 rounded-full font-bold text-xs sm:text-sm hover:bg-[#fdfaf3] transition-all cursor-pointer"
              >
                Cancel·lar
              </button>
              <button
                onClick={handleSaveReserva}
                disabled={savingReserva}
                className="bg-[#ba5940] hover:bg-[#432918] text-white font-bold py-2.5 px-5 rounded-full transition-colors flex justify-center items-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer text-xs sm:text-sm"
              >
                {savingReserva ? "Desant..." : "Desar canvis"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
