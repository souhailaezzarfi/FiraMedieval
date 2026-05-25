import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const formatarData = (dataString) => {
  if (dataString === "Sense data") return dataString;
  const opcions = { weekday: "long", day: "numeric", month: "long" };
  const data = new Date(dataString);
  const text = data.toLocaleDateString("ca-ES", opcions);
  return text.charAt(0).toUpperCase() + text.slice(1);
};

function Activitats() {
  const [dadesActivitats, setDadesActivitats] = useState([]);
  const [carregant, setCarregant] = useState(true);
  const [error, setError] = useState(null);

  const [cerca, setCerca] = useState("");
  const [categoria, setCategoria] = useState("Totes");
  const [ubicacio, setUbicacio] = useState("Totes");
  const [ocultarFinalitzades, setOcultarFinalitzades] = useState(false);
  const [diaSeleccionat, setDiaSeleccionat] = useState("Tots");

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchActivitats = async () => {
      try {
        setCarregant(true);
        const response = await api.get("/activitats");
        const activitatsAplanades = [];

        response.data.forEach((act) => {
          if (act.horaris && act.horaris.length > 0) {
            const horarisPorDia = {};
            act.horaris.forEach((horari) => {
              const dataObj = new Date(horari.hora_inici.replace(" ", "T"));
              const dataKey = dataObj.toISOString().split("T")[0];
              if (!horarisPorDia[dataKey]) horarisPorDia[dataKey] = [];
              horarisPorDia[dataKey].push(dataObj);
            });

            Object.entries(horarisPorDia).forEach(([dataKey, hores]) => {
              hores.sort((a, b) => a - b);
              const primeraHora = hores[0];
              activitatsAplanades.push({
                ...act,
                id_unica: `${act.id}-${dataKey}`,
                data: dataKey,
                hora: primeraHora.toLocaleTimeString("ca-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                hores_dia: hores.map((h) =>
                  h.toLocaleTimeString("ca-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                ),
                data_obj: primeraHora,
              });
            });
          } else {
            activitatsAplanades.push({
              ...act,
              id_unica: `${act.id}-sense-hora`,
              data: "Sense data",
              hora: "--:--",
              hores_dia: [],
              data_obj: new Date(8640000000000000),
            });
          }
        });

        setDadesActivitats(activitatsAplanades);
        setError(null);
      } catch (err) {
        setError("No s'han pogut carregar les activitats de la base de dades.");
      } finally {
        setCarregant(false);
      }
    };

    fetchActivitats();
  }, []);

  const categories = [
    "Totes",
    ...new Set(
      dadesActivitats.flatMap((a) => a.categories?.map((c) => c.nom) || []),
    ),
  ];

  const ubicacions = [
    "Totes",
    ...new Set(dadesActivitats.map((a) => a.ubicacio)),
  ];

  const diesUnics = [
    ...new Set(
      dadesActivitats.filter((a) => a.data !== "Sense data").map((a) => a.data),
    ),
  ].sort();

  const dies = ["Tots", "Repeteix", ...diesUnics];

  const totalDiesFira = diesUnics.length;

  const diesPerActivitat = useMemo(() => {
    const mapa = {};
    dadesActivitats.forEach((a) => {
      if (!mapa[a.id]) mapa[a.id] = new Set();
      if (a.data !== "Sense data") mapa[a.id].add(a.data);
    });
    return mapa;
  }, [dadesActivitats]);

  const activitatsAgrupades = useMemo(() => {
    const filtrades = dadesActivitats.filter((activitat) => {
      const coincideixCerca = activitat.nom
        .toLowerCase()
        .includes(cerca.toLowerCase());
      const coincideixCategoria =
        categoria === "Totes" ||
        (activitat.categories &&
          activitat.categories.some((c) => c.nom === categoria));
      const coincideixUbicacio =
        ubicacio === "Totes" || activitat.ubicacio === ubicacio;
      const noFinalitzada = ocultarFinalitzades
        ? activitat.data_obj >= new Date()
        : true;

      const diesAct = diesPerActivitat[activitat.id]?.size ?? 0;
      const coincideixDia =
        diaSeleccionat === "Tots" ||
        (diaSeleccionat === "Repeteix" &&
          totalDiesFira > 0 &&
          diesAct === totalDiesFira) ||
        activitat.data === diaSeleccionat;

      return (
        coincideixCerca &&
        coincideixCategoria &&
        coincideixUbicacio &&
        noFinalitzada &&
        coincideixDia
      );
    });

    const activitatsAMostrar =
      diaSeleccionat === "Repeteix"
        ? Object.values(
            filtrades.reduce((acc, a) => {
              if (!acc[a.id]) acc[a.id] = a;
              return acc;
            }, {}),
          )
        : filtrades;

    const agrupades = activitatsAMostrar.reduce((acc, activitat) => {
      const clau = diaSeleccionat === "Repeteix" ? "Repeteix" : activitat.data;
      if (!acc[clau]) acc[clau] = [];
      acc[clau].push(activitat);
      return acc;
    }, {});

    return Object.keys(agrupades)
      .sort()
      .reduce((obj, key) => {
        obj[key] = agrupades[key].sort((a, b) => a.hora.localeCompare(b.hora));
        return obj;
      }, {});
  }, [
    dadesActivitats,
    cerca,
    categoria,
    ubicacio,
    ocultarFinalitzades,
    diaSeleccionat,
    diesPerActivitat,
    totalDiesFira,
  ]);

  if (carregant) {
    return (
      <div className="w-full flex justify-center items-center py-32">
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-[#432918]">
      <h1 className="text-5xl md:text-5xl font-serif font-bold text-center mb-12">
        Activitats
      </h1>

      <div className="w-full">
        {/* Barra de filtres */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm mb-12 border border-[#432918]/10 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
            <div className="flex flex-row items-center justify-between w-full sm:w-auto gap-3">
              <label className="text-sm font-semibold text-[#432918]/80 whitespace-nowrap">
                Dia:
              </label>
              <div className="relative w-60">
                <select
                  value={diaSeleccionat}
                  onChange={(e) => setDiaSeleccionat(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 border border-[#432918]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ba5940] bg-[#fdfaf3] text-sm font-medium cursor-pointer"
                >
                  {dies.map((dia) => (
                    <option key={dia} value={dia}>
                      {dia === "Tots"
                        ? "Tots els dies"
                        : dia === "Repeteix"
                          ? "Es repeteix cada dia"
                          : formatarData(dia)}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#432918]/50 pointer-events-none">
                  &#xe5c5;
                </span>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between w-full sm:w-auto gap-3">
              <label className="text-sm font-semibold text-[#432918]/80 whitespace-nowrap">
                Categoria:
              </label>
              <div className="relative w-60">
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 border border-[#432918]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ba5940] bg-[#fdfaf3] text-sm font-medium cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#432918]/50 pointer-events-none">
                  &#xe5c5;
                </span>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between w-full sm:w-auto gap-3">
              <label className="text-sm font-semibold text-[#432918]/80 whitespace-nowrap">
                Ubicació:
              </label>
              <div className="relative w-60">
                <select
                  value={ubicacio}
                  onChange={(e) => setUbicacio(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 border border-[#432918]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ba5940] bg-[#fdfaf3] text-sm font-medium cursor-pointer"
                >
                  {ubicacions.map((ubi) => (
                    <option key={ubi} value={ubi}>
                      {ubi}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#432918]/50 pointer-events-none">
                  &#xe5c5;
                </span>
              </div>
            </div>
          </div>

          {/* cerca + checkbox  */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-evenly">
            <div className="relative w-full sm:w-96">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#432918]/50">
                &#xe8b6;
              </span>
              <input
                type="text"
                placeholder="Cercar activitats..."
                value={cerca}
                onChange={(e) => setCerca(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-[#432918]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ba5940] focus:border-transparent transition-all bg-[#fdfaf3]"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer group shrink-0">
              <input
                type="checkbox"
                checked={ocultarFinalitzades}
                onChange={(e) => setOcultarFinalitzades(e.target.checked)}
                className="w-5 h-5 rounded border-[#432918]/30 text-[#ba5940] focus:ring-[#ba5940] transition-colors cursor-pointer"
              />
              <span className="text-sm font-semibold text-[#432918]/80 group-hover:text-[#ba5940] transition-colors whitespace-nowrap">
                Ocultar activitats finalitzades
              </span>
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-[#ba5940]/10 border-l-4 border-[#ba5940] p-4 rounded-r-lg mt-2 mb-8 text-[#ba5940] font-bold">
            <p>
              <span className="material-symbols-outlined align-middle mr-2 text-lg">
                &#xe002;
              </span>
              {error}
            </p>
          </div>
        )}

        {!error && Object.keys(activitatsAgrupades).length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-[#432918]/20 mb-4 block">
              &#xe8b6;
            </span>
            <p className="text-xl text-[#432918] font-bold">
              No s'han trobat activitats amb aquests filtres.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.keys(activitatsAgrupades).map((dataStr) => (
              <div key={dataStr} className="mb-12">
                <h2 className="text-3xl font-serif font-bold mb-6 flex items-center gap-3 text-[#432918]">
                  <span className="material-symbols-outlined text-[#ba5940] text-3xl">
                    &#xe878;
                  </span>
                  {dataStr === "Repeteix"
                    ? "Es repeteix tots els dies de la fira"
                    : formatarData(dataStr)}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activitatsAgrupades[dataStr].map((activitat) => (
                    <Link
                      to={`/activitats/${activitat.id}`}
                      key={activitat.id_unica}
                      className="border border-[#432918]/20 p-5 rounded-2xl shadow-sm bg-white/50 flex flex-col sm:flex-row sm:items-center gap-5 transition-all group hover:bg-white/80 cursor-pointer"
                    >
                      <div className="w-full sm:w-32 h-48 sm:h-32 shrink-0 overflow-hidden rounded-xl bg-[#ba5940]/10 border border-[#ba5940]/20 flex items-center justify-center">
                        {activitat.imatge ? (
                          <img
                            src={activitat.imatge}
                            alt={activitat.nom}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-4xl text-[#ba5940]/40">
                            &#xe412;
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col justify-center py-1">
                        <h3 className="text-xl font-bold text-[#432918] mb-3 leading-tight group-hover:text-[#ba5940] transition-colors">
                          {activitat.nom}
                        </h3>

                        <ul className="text-base font-bold space-y-2 ml-1">
                          <li className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#461615] text-[22px]">
                              &#xe192;
                            </span>
                            <span className="font-normal text-[#432918]">
                              {activitat.hores_dia.length > 1
                                ? activitat.hores_dia.join(", ") + " h"
                                : activitat.hora + " h"}
                            </span>
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#461615] text-[22px]">
                              &#xe569;
                            </span>
                            <span className="font-normal text-[#432918]">
                              {activitat.ubicacio}
                            </span>
                          </li>
                        </ul>

                        {activitat.aforament && isLoggedIn && (
                          <div className="mt-4">
                            {!activitat.inscripcio_usuari && (
                              <div className="flex items-center gap-2 bg-green-100 text-green-800 w-fit px-3 py-1.5 rounded-lg text-sm font-bold border border-green-200">
                                <span className="material-symbols-outlined text-[18px]">
                                  &#xe86c;
                                </span>
                                Inscripcions obertes
                              </div>
                            )}
                            {activitat.inscripcio_usuari?.estat ===
                              "acceptada" && (
                              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 w-fit px-3 py-1.5 rounded-lg text-sm font-bold border border-blue-200">
                                <span className="material-symbols-outlined text-[18px]">
                                  &#xe86c;
                                </span>
                                Inscripció acceptada
                              </div>
                            )}
                            {activitat.inscripcio_usuari?.estat ===
                              "espera" && (
                              <div className="flex items-center gap-2 bg-orange-100 text-orange-800 w-fit px-3 py-1.5 rounded-lg text-sm font-bold border border-orange-200">
                                <span className="material-symbols-outlined text-[18px]">
                                  &#xe192;
                                </span>
                                En llista d'espera
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Activitats;
