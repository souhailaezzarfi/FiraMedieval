import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const formatarData = (dataString) => {
  if (!dataString) return "";
  const opcionsData = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const dataObj = new Date(dataString.replace(" ", "T"));
  const dataText = dataObj.toLocaleDateString("ca-ES", opcionsData);
  return dataText.charAt(0).toUpperCase() + dataText.slice(1);
};

const formatarHora = (dataString) => {
  if (!dataString) return "";
  const dataObj = new Date(dataString.replace(" ", "T"));
  return dataObj.toLocaleTimeString("ca-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

function ActivitatDetall() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activitat, setActivitat] = useState(null);
  const [carregant, setCarregant] = useState(true);
  const [error, setError] = useState(null);
  const [estatEnviament, setEstatEnviament] = useState("idle");
  const [selectedHorariId, setSelectedHorariId] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchActivitat = async () => {
      try {
        setCarregant(true);
        const response = await api.get(`/activitats/${id}`);
        let dataActivitat = response.data;

        // Seleccionar el primer horari per defecte quan carreguen les dades
        if (dataActivitat?.horaris?.length > 0) {
          setSelectedHorariId(dataActivitat.horaris[0].id);
        }

        if (isLoggedIn) {
          try {
            const inscripcionsRes = await api.get(
              `/inscripcions?activitat_id=${id}`,
            );
            const llistaInscripcions = inscripcionsRes.data;

            if (llistaInscripcions && llistaInscripcions.length > 0) {
              if (dataActivitat.horaris && dataActivitat.horaris.length > 0) {
                dataActivitat.horaris = dataActivitat.horaris.map((h) => {
                  const ins = llistaInscripcions.find(
                    (i) => i.horari_id == h.id,
                  );
                  if (ins) {
                    return {
                      ...h,
                      inscripcio_usuari: {
                        estat:
                          ins.estat === "espera"
                            ? "espera"
                            : ins.estat === "cancel·lada"
                              ? "cancel·lada"
                              : "acceptada",
                      },
                    };
                  }
                  return h;
                });
              } else {
                const estatReal = llistaInscripcions[0].estat;
                dataActivitat.inscripcio_usuari = {
                  estat:
                    estatReal === "espera"
                      ? "espera"
                      : estatReal === "cancel·lada"
                        ? "cancel·lada"
                        : "acceptada",
                };
              }
            }
          } catch (insErr) {
            console.error(
              "No s'han pogut carregar les inscripcions de l'usuari:",
              insErr,
            );
          }
        }

        setActivitat(dataActivitat);
        setError(null);
      } catch (err) {
        console.error("Error carregant el detall de l'activitat:", err);
        setError("No s'ha pogut carregar la informació de l'activitat.");
      } finally {
        setCarregant(false);
      }
    };

    if (id) {
      fetchActivitat();
    }
  }, [id, isLoggedIn]);

  const handleInscripcio = async () => {
    if (!isLoggedIn) return;

    if (
      !selectedHorariId &&
      activitat.horaris &&
      activitat.horaris.length > 0
    ) {
      alert("Si us plau, selecciona una franja horària.");
      return;
    }

    setEstatEnviament("loading");

    try {
      const response = await api.post("/inscripcions", {
        activitat_id: activitat.id,
        horari_id: selectedHorariId,
      });

      const estatReal =
        response.data.inscripcio?.estat || response.data.estat || "confirmada";
      const nouEstatUI = estatReal === "espera" ? "espera" : "acceptada";

      setActivitat((prev) => {
        const updatedHoraris = prev.horaris?.map((h) =>
          h.id == selectedHorariId
            ? { ...h, inscripcio_usuari: { estat: nouEstatUI } }
            : h,
        );
        return {
          ...prev,
          horaris: updatedHoraris,
          ...(!prev.horaris || prev.horaris.length === 0
            ? { inscripcio_usuari: { estat: nouEstatUI } }
            : {}),
        };
      });
      setEstatEnviament("success");
    } catch (err) {
      console.error("Error al fer la inscripció:", err);
      if (err.response && err.response.status === 409) {
        setActivitat((prev) => {
          const updatedHoraris = prev.horaris?.map((h) =>
            h.id == selectedHorariId
              ? { ...h, inscripcio_usuari: { estat: "acceptada" } }
              : h,
          );
          return {
            ...prev,
            horaris: updatedHoraris,
          };
        });
        setEstatEnviament("success");
      } else if (err.response && err.response.status === 403) {
        alert("Inscripcions tancades per aquesta franja");
        setEstatEnviament("idle");
      } else {
        setEstatEnviament("idle");
      }
    }
  };

  let inscripcioActual = null;
  if (activitat) {
    if (activitat.horaris && activitat.horaris.length > 0) {
      const horariSeleccionat = activitat.horaris.find(
        (h) => h.id == selectedHorariId,
      );
      inscripcioActual = horariSeleccionat?.inscripcio_usuari;
    } else {
      inscripcioActual = activitat.inscripcio_usuari;
    }
  }

  const horarisAgrupats = {};
  if (activitat?.horaris) {
    activitat.horaris.forEach((horari) => {
      const dataStr = formatarData(horari.hora_inici);
      if (!horarisAgrupats[dataStr]) {
        horarisAgrupats[dataStr] = [];
      }
      let horaStr = `${formatarHora(horari.hora_inici)} h`;
      if (horari.hora_final) {
        horaStr += ` - ${formatarHora(horari.hora_final)} h`;
      }
      horarisAgrupats[dataStr].push(horaStr);
    });
  }

  if (carregant) {
    return (
      <div className="w-full min-h-[60vh] flex justify-center items-center py-32">
        <svg
          className="animate-spin h-12 w-12 text-[#ba5940]"
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
    );
  }

  if (error || !activitat) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-[#ba5940]/10 border-l-4 border-[#ba5940] p-6 rounded-r-lg inline-block text-[#ba5940] font-bold">
          <p className="flex items-center gap-3 text-lg">
            <span className="material-symbols-outlined text-2xl">&#xe000;</span>
            {error || "Activitat no trobada"}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-8 bg-[#432918] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#ba5940] transition-colors cursor-pointer"
        >
          Tornar enrere
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-[#432918] pb-24">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#432918]/70 hover:text-[#ba5940] transition-colors font-bold mb-8 group bg-white/50 border border-[#432918]/10 py-2 px-5 rounded-full shadow-sm w-fit cursor-pointer"
      >
        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
          &#xe5c4;
        </span>
        Tornar a l'inici
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-16">
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="mb-8">
            {activitat.categories && activitat.categories.length > 0 && (
              <span className="text-[#ba5940] font-bold text-sm tracking-wider uppercase mb-2 block">
                {activitat.categories.map((c) => c.nom).join(" • ")}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#432918] leading-tight mb-4">
              {activitat.nom}
            </h1>
            {activitat.organitzador && (
              <p className="text-xl text-[#432918]/80 font-medium mb-8">
                Organitza:{" "}
                <span className="text-[#432918] font-bold">
                  {activitat.organitzador}
                </span>
              </p>
            )}
          </div>

          <div className="w-full h-64 md:h-80 rounded-3xl overflow-hidden mb-8 bg-[#ba5940]/10 border border-[#ba5940]/20 flex items-center justify-center shadow-sm">
            {activitat.imatge ? (
              <img
                src={activitat.imatge}
                alt={activitat.nom}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-6xl text-[#ba5940]/30">
                &#xe3f4;
              </span>
            )}
          </div>

          <div className="prose max-w-none text-lg text-[#432918]/90 leading-relaxed text-justify mb-10">
            {activitat.descripcio.split("\n").map((paragraf, idx) => (
              <p key={idx} className="mb-4">
                {paragraf}
              </p>
            ))}
          </div>

          {activitat.aforament && (
            <div className="border border-[#432918]/20 p-6 md:p-8 rounded-2xl shadow-sm bg-white/50 mt-auto">
              <h3 className="text-2xl font-serif font-bold text-[#432918] mb-6">
                Inscripcions
              </h3>

              <div className="flex flex-col sm:flex-row items-end gap-4 w-full">
                {activitat.horaris && activitat.horaris.length > 1 && (
                  <div className="w-full sm:flex-1">
                    <label className="block text-[11px] font-bold mb-2 text-[#432918]/50 uppercase tracking-wider">
                      Selecciona la franja horària
                    </label>
                    <div className="relative">
                      <select
                        value={selectedHorariId}
                        onChange={(e) => {
                          setSelectedHorariId(e.target.value);
                          setEstatEnviament("idle");
                        }}
                        className="w-full px-4 py-3 border border-[#432918]/20 rounded-xl focus:outline-none focus:border-[#ba5940] focus:ring-1 focus:ring-[#ba5940] bg-[#fdfaf3] text-[#432918] appearance-none font-medium text-sm cursor-pointer"
                      >
                        {activitat.horaris.map((h) => (
                          <option key={h.id} value={h.id}>
                            {formatarDataCurta(h.hora_inici)} -{" "}
                            {formatarHora(h.hora_inici)} h{" "}
                            {h.hora_final
                              ? `a ${formatarHora(h.hora_final)} h`
                              : ""}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#432918]/50 pointer-events-none">
                        &#xe5c5;
                      </span>
                    </div>
                  </div>
                )}

                <div className="w-full sm:w-auto sm:min-w-65">
                  {!isLoggedIn && (
                    <div className="bg-blue-100 text-blue-800 border border-blue-200 font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-3 w-full">
                      <span className="material-symbols-outlined">
                        &#xe897;
                      </span>
                      Inicia sessió per inscriure't
                    </div>
                  )}

                  {isLoggedIn && inscripcioActual?.estat === "acceptada" && (
                    <div className="bg-green-100 text-green-800 border border-green-200 font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-3 w-full">
                      <span className="material-symbols-outlined">
                        &#xe86c;
                      </span>
                      Inscripció acceptada
                    </div>
                  )}

                  {isLoggedIn && inscripcioActual?.estat === "espera" && (
                    <div className="bg-blue-100 text-blue-800 border border-blue-200 font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-3 w-full">
                      <span className="material-symbols-outlined">
                        &#xe192;
                      </span>
                      En llista d'espera
                    </div>
                  )}

                  {isLoggedIn && inscripcioActual?.estat === "cancel·lada" && (
                    <div className="bg-red-50 text-red-800 border border-red-200 font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-3 w-full">
                      <span className="material-symbols-outlined">
                        &#xe5c9;
                      </span>
                      Inscripció cancel·lada
                    </div>
                  )}

                  {isLoggedIn &&
                    (!inscripcioActual ||
                      inscripcioActual?.estat === "cancel·lada") && (
                      <button
                        onClick={handleInscripcio}
                        disabled={estatEnviament !== "idle"}
                        className={`w-full text-white font-bold py-3 px-6 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm mt-2 ${
                          estatEnviament === "loading"
                            ? "bg-[#ba5940]/70 cursor-wait"
                            : "bg-[#ba5940] hover:bg-[#432918] cursor-pointer"
                        }`}
                      >
                        {estatEnviament === "idle" && (
                          <>
                            <span className="material-symbols-outlined">
                              &#xe7fe;
                            </span>
                            {inscripcioActual?.estat === "cancel·lada"
                              ? "Torna a inscriure't"
                              : "Inscriu-te"}
                          </>
                        )}

                        {estatEnviament === "loading" && (
                          <>
                            Processant...
                            <svg
                              className="animate-spin h-5 w-5 text-white"
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
                          </>
                        )}
                      </button>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 flex flex-col gap-8 h-full">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#432918]/10">
            <h3 className="text-2xl font-serif font-bold text-[#432918] mb-6">
              Informació
            </h3>

            <ul className="space-y-6">
              {activitat.horaris && activitat.horaris.length > 0 && (
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-[#461615] mt-1">
                    &#xe192;
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#432918]/50 uppercase tracking-wider mb-2">
                      Horari
                    </p>
                    <div className="space-y-4">
                      {Object.entries(horarisAgrupats).map(([data, hores]) => (
                        <div key={data} className="flex flex-col">
                          <span className="text-[#432918] font-bold text-base">
                            {data}
                          </span>
                          <span className="font-normal text-[#432918]/80 text-[15px]">
                            {hores.join(", ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              )}

              <li className="flex gap-4">
                <span className="material-symbols-outlined text-[#461615] mt-1">
                  &#xe569;
                </span>
                <div>
                  <p className="text-xs font-bold text-[#432918]/50 uppercase tracking-wider mb-1">
                    Ubicació
                  </p>
                  <p className="text-[#432918] font-bold text-base">
                    {activitat.ubicacio}
                  </p>
                </div>
              </li>

              {activitat.aforament && (
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-[#461615] mt-1">
                    &#xe7ef;
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#432918]/50 uppercase tracking-wider mb-1">
                      Aforament
                    </p>
                    <p className="text-[#432918] font-bold text-base">
                      {activitat.aforament}{" "}
                      {activitat.aforament === 1 ? "persona" : "persones"}
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#432918]/10 flex flex-col h-72 mt-auto">
            <h3 className="text-2xl font-serif font-bold text-[#432918] mb-4">
              Ubicació
            </h3>
            <div className="grow bg-[#fdfaf3] rounded-xl relative overflow-hidden border border-[#432918]/10">
              {activitat.ubicacio ? (
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(activitat.ubicacio + ", Hostalric")}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full text-[#432918]/40">
                  <span className="material-symbols-outlined text-4xl">
                    &#xe55b;
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivitatDetall;
