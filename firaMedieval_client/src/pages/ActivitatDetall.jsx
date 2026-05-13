import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const formatarDataHora = (dataString) => {
  if (!dataString) return "";
  const opcionsData = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const dataObj = new Date(dataString.replace(" ", "T"));

  const dataText = dataObj.toLocaleDateString("ca-ES", opcionsData);
  const dataCapitalitzada =
    dataText.charAt(0).toUpperCase() + dataText.slice(1);

  const horaText = dataObj.toLocaleTimeString("ca-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dataCapitalitzada}, ${horaText} h`;
};

function ActivitatDetall() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activitat, setActivitat] = useState(null);
  const [carregant, setCarregant] = useState(true);
  const [error, setError] = useState(null);

  // Comprovem si l'usuari ha iniciat sessió
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchActivitat = async () => {
      try {
        setCarregant(true);
        // Suposem que la teva API retorna el detall a /activitats/{id}
        const response = await api.get(`/activitats/${id}`);
        setActivitat(response.data);
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
  }, [id]);

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

      <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-12 bg-[#ba5940]/10 border border-[#ba5940]/20 flex items-center justify-center shadow-sm">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-16">
        <div className="lg:col-span-2">
          <div className="mb-4">
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

          <div className="prose max-w-none text-lg text-[#432918]/90 leading-relaxed text-justify">
            {activitat.descripcio.split("\n").map((paragraf, idx) => (
              <p key={idx} className="mb-4">
                {paragraf}
              </p>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#432918]/10">
            <h3 className="text-2xl font-serif font-bold text-[#432918] mb-6">
              Informació
            </h3>

            <ul className="space-y-6 mb-8">
              {/* Horaris */}
              {activitat.horaris && activitat.horaris.length > 0 && (
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-[#461615] mt-1">
                    &#xe192;
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#432918]/50 uppercase tracking-wider mb-1">
                      Data i Hora
                    </p>
                    <div className="space-y-1">
                      {activitat.horaris.map((horari) => (
                        <p
                          key={horari.id}
                          className="text-[#432918] font-bold text-base"
                        >
                          {formatarDataHora(horari.hora_inici)}
                          {horari.hora_final && (
                            <span className="font-normal text-[#432918]/70">
                              {" "}
                              fins les{" "}
                              {new Date(
                                horari.hora_final.replace(" ", "T"),
                              ).toLocaleTimeString("ca-ES", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              h
                            </span>
                          )}
                        </p>
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
                      Limitat a {activitat.aforament} persones
                    </p>
                  </div>
                </li>
              )}
            </ul>

            {/* ZONA D'INSCRIPCIONS */}
            {activitat.aforament && (
              <>
                <hr className="border-[#432918]/10 mb-6" />

                <div>
                  <p className="font-bold text-[#432918] mb-4">Inscripcions</p>

                  {/* Mostrem tag només si estem loguejats */}
                  {isLoggedIn && !activitat.inscripcio_usuari && (
                    <div className="bg-green-100 text-green-800 border border-green-200 font-bold px-4 py-3 rounded-xl flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined">
                        &#xe86c;
                      </span>
                      Inscripcions obertes
                    </div>
                  )}

                  {isLoggedIn &&
                    activitat.inscripcio_usuari?.estat === "acceptada" && (
                      <div className="bg-blue-100 text-blue-800 border border-blue-200 font-bold px-4 py-3 rounded-xl flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined">
                          &#xe86c;
                        </span>
                        Inscripció acceptada
                      </div>
                    )}

                  {isLoggedIn &&
                    activitat.inscripcio_usuari?.estat === "espera" && (
                      <div className="bg-orange-100 text-orange-800 border border-orange-200 font-bold px-4 py-3 rounded-xl flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined">
                          &#xe192;
                        </span>
                        En llista d'espera
                      </div>
                    )}

                  {/* Mostrem el botó si NO està inscrit. 
                      Això inclou usuaris no loguejats per poder-los redirigir al login en el futur. */}
                  {!activitat.inscripcio_usuari && (
                    <button className="w-full bg-[#ba5940] hover:bg-[#432918] text-white font-bold py-3 px-6 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm cursor-pointer">
                      <span className="material-symbols-outlined">
                        &#xe7fe;
                      </span>
                      {isLoggedIn
                        ? "Inscriu-te"
                        : "Inicia sessió per inscriure't"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#432918]/10 flex flex-col h-72">
            <h3 className="text-2xl font-serif font-bold text-[#432918] mb-4">
              Ubicació
            </h3>
            <div className="grow bg-[#fdfaf3] border-2 border-dashed border-[#432918]/20 rounded-xl flex flex-col items-center justify-center text-[#432918]/40 relative overflow-hidden group">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23432918' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
              ></div>

              <span className="material-symbols-outlined text-5xl mb-2 group-hover:scale-110 transition-transform text-[#ba5940]">
                &#xe55b;
              </span>
              <span className="font-semibold text-sm px-4 text-center z-10">
                Mapa
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivitatDetall;
