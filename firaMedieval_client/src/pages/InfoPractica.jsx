import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { FaCar, FaBus, FaTrain } from "react-icons/fa";
import { FaCaravan } from "react-icons/fa6";
import aparcamentService from "../services/aparcamentService";
import reservaService from "../services/reservaAutocaravanaService";
import { useAuth } from "../context/AuthContext";

// Logos de les línies de Rodalies
import r2Logo from "../assets/rodalies/R2.jpg";
import r11Logo from "../assets/rodalies/R11.jpg";

const inscripcioSchema = z.object({
  marca: z.string().min(1, "La marca és obligatòria"),
  model: z.string().min(1, "Model obligatòri"),
  matricula: z.string().min(1, "La matrícula és obligatòria"),
  procedencia: z.string().min(1, "Procedencia obligatòria"),
  totalPersones: z.coerce.number().min(1, "Mínim 1 persona"),
  dataArribada: z.string().min(1, "Data obligatòria"),
  dataSortida: z.string().min(1, "Data obligatòria"),
  acceptoTermes: z.boolean().refine((val) => val === true, {
    message: "Heu d'acceptar els termes i condicions",
  }),
});

const tabs = [
  { id: "cotxe", label: "Cotxe", icon: <FaCar /> },
  { id: "tren", label: "Tren", icon: <FaTrain /> },
  { id: "bus", label: "Bus", icon: <FaBus /> },
  { id: "autocaravana", label: "Autocaravana", icon: <FaCaravan /> },
];

function InfoPractica() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabActiva = searchParams.get("tab") ?? "cotxe";

  const setTabActiva = (tab) => setSearchParams({ tab });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [aparcamentActiu, setAparcamentActiu] = useState(null);
  const [loadingAparcament, setLoadingAparcament] = useState(false);

  const [formData, setFormData] = useState({
    marca: "",
    model: "",
    matricula: "",
    procedencia: "",
    totalPersones: 1,
    dataArribada: "",
    dataSortida: "",
    acceptoTermes: false,
  });

  const [estatEnviament, setEstatEnviament] = useState("idle");
  const [errors, setErrors] = useState({});
  const [isAltreMarca, setIsAltreMarca] = useState(false);

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (tabActiva !== "autocaravana") return;
    setLoadingAparcament(true);
    aparcamentService
      .getActiu()
      .then((res) => setAparcamentActiu(res.data))
      .catch(() => setAparcamentActiu({ obert: false }))
      .finally(() => setLoadingAparcament(false));
  }, [tabActiva]);

  const tancaModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
      setErrors({});
      setEstatEnviament("idle");
    }, 200);
  };

  // comprova si l'usuari està logat abans d'obrir el modal
  const handleObrirModal = () => {
    if (!user) {
      navigate("/login", {
        state: { from: "/info-practica?tab=autocaravana" },
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleMarcaSelectChange = (e) => {
    if (e.target.value === "Altres") {
      setIsAltreMarca(true);
      setFormData((prev) => ({ ...prev, marca: "" }));
      if (errors.marca) setErrors((prev) => ({ ...prev, marca: undefined }));
    } else {
      handleChange(e);
    }
  };

  const netejarError = (e) => {
    const { id } = e.target;
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultatValidacio = inscripcioSchema.safeParse(formData);
    const nousErrors = {};

    if (!resultatValidacio.success) {
      resultatValidacio.error.issues.forEach((issue) => {
        if (!nousErrors[issue.path[0]])
          nousErrors[issue.path[0]] = issue.message;
      });
    }

    if (formData.dataArribada && formData.dataSortida) {
      if (new Date(formData.dataSortida) < new Date(formData.dataArribada)) {
        nousErrors.dataSortida =
          "La data de sortida no pot ser anterior a la d'arribada.";
      }
      if (
        new Date(formData.dataArribada) <
        new Date(aparcamentActiu.aparcament.data_inici)
      ) {
        nousErrors.dataArribada =
          "La data d'arribada no pot ser anterior a l'obertura de l'aparcament.";
      }
      if (
        new Date(formData.dataSortida) >
        new Date(aparcamentActiu.aparcament.data_final)
      ) {
        nousErrors.dataSortida =
          "La data de sortida no pot ser posterior al tancament de l'aparcament.";
      }
    }

    if (Object.keys(nousErrors).length > 0) {
      setErrors(nousErrors);
      return;
    }

    setErrors({});
    setEstatEnviament("loading");

    try {
      const res = await reservaService.create({
        aparcament_id: aparcamentActiu.aparcament.id,
        marca_vehicle: formData.marca,
        model_vehicle: formData.model,
        matricula: formData.matricula,
        procedencia: formData.procedencia,
        total_persones: formData.totalPersones,
        data_arribada: formData.dataArribada,
        data_sortida: formData.dataSortida,
      });

      const nouEstat = res.data.estat === "espera" ? "espera" : "success";
      setEstatEnviament(nouEstat);

      setTimeout(() => {
        tancaModal();
        setTimeout(() => {
          setEstatEnviament("idle");
          setFormData({
            marca: "",
            model: "",
            matricula: "",
            procedencia: "",
            totalPersones: 1,
            dataArribada: "",
            dataSortida: "",
            acceptoTermes: false,
          });
          setIsAltreMarca(false);
        }, 200);
      }, 2000);
    } catch (err) {
      setEstatEnviament("idle");
      const msg = err.response?.data?.message ?? "";
      if (msg.toLowerCase().includes("ja tens una reserva")) {
        setErrors({
          general:
            "Ja tens una reserva activa. Només es permet una reserva per usuari.",
        });
      } else if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const nousErrors = {};
        if (backendErrors.model_vehicle)
          nousErrors.model = backendErrors.model_vehicle[0];
        if (backendErrors.procedencia)
          nousErrors.procedencia = backendErrors.procedencia[0];
        if (backendErrors.marca_vehicle)
          nousErrors.marca = backendErrors.marca_vehicle[0];
        if (backendErrors.matricula)
          nousErrors.matricula = backendErrors.matricula[0];
        if (backendErrors.total_persones)
          nousErrors.totalPersones = backendErrors.total_persones[0];
        if (backendErrors.data_arribada)
          nousErrors.dataArribada = backendErrors.data_arribada[0];
        if (backendErrors.data_sortida)
          nousErrors.dataSortida = backendErrors.data_sortida[0];
        setErrors(nousErrors);
      } else {
        setErrors({
          general:
            "Hi ha hagut un error en enviar la reserva. Torna-ho a intentar.",
        });
      }
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all bg-white disabled:opacity-60 disabled:cursor-not-allowed ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-[#432918]/20 focus:border-[#ba5940] focus:ring-[#ba5940]"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-[#432918] relative">
      <h1 className="text-5xl font-serif font-bold text-center mb-12">
        Informació pràctica
      </h1>

      <div className="max-w-5xl mx-auto">
        {/* TABS */}
        <div className="flex gap-3 flex-wrap mb-8 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-semibold text-sm transition-all cursor-pointer ${
                tabActiva === tab.id
                  ? "bg-[#432918] text-white border-[#432918]"
                  : "bg-white/50 text-[#432918] border-[#432918]/30 hover:border-[#432918]"
              }`}
            >
              <span className="material-symbols-outlined text-base leading-none">
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* COTXE */}
        {tabActiva === "cotxe" && (
          <div className="space-y-6 text-justify">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-5 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ba5940] text-3xl">
                  <FaCar />
                </span>
                Aparcaments per turismes
              </h2>
              <p className="text-lg leading-relaxed mb-4">
                Per facilitar l'accés a la fira, s'habilitaran aparcaments
                gratuïts en diversos punts del municipi:
              </p>
              <ul className="text-base font-bold space-y-3 mb-8 ml-2">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ba5940] text-lg">
                    &#xe5cc;
                  </span>
                  Zona esportiva municipal (ZEM)
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ba5940] text-lg">
                    &#xe5cc;
                  </span>
                  Estació de tren
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ba5940] text-lg">
                    &#xe5cc;
                  </span>
                  Altres zones habilitades
                </li>
              </ul>
              <div className="border border-[#432918]/20 p-6 rounded-2xl shadow-sm bg-white/50">
                <p className="text-lg leading-relaxed mb-3">
                  S'habilitarà un servei de trenet llançadora per facilitar
                  l'accés a les persones que aparquin a la{" "}
                  <strong>zona esportiva municipal (ZEM)</strong>, podent fer el
                  desplaçament fins a la plaça de l'escola, punt d'inici de la
                  Fira.
                </p>
                <p className="text-lg font-bold text-[#ba5940]">
                  Aquest servei té un cost de 2€ per trajecte.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TREN */}
        {tabActiva === "tren" && (
          <div className="space-y-6 text-justify">
            <h2 className="text-3xl font-serif font-bold mb-5 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ba5940] text-3xl">
                <FaTrain />
              </span>
              Tren
            </h2>

            <div className="bg-[#ba5940]/10 border-l-4 border-[#ba5940] p-4 rounded-r-lg mb-8">
              <p className="text-base font-bold text-[#ba5940]">
                Horaris subjectes a modificacions. Consulteu la web o app de
                Rodalies.{" "}
                <a
                  href="https://www.renfe.com/es"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:opacity-70 transition-opacity"
                >
                  www.renfe.com
                </a>
              </p>
            </div>

            {/* CARD R11 AMB IMATGE LOGOTIP */}
            <div className="border border-[#432918]/20 p-6 rounded-2xl bg-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={r11Logo}
                  alt="Logotip R11 Rodalies"
                  className="w-16 h-16 object-contain rounded-xl shadow-xs shrink-0"
                />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#ba5940] mb-0.5">
                    Recomanada
                  </p>
                  <h3 className="text-xl font-serif font-bold mb-1">
                    Barcelona Sants ↔ Portbou
                  </h3>
                  <p className="text-sm leading-relaxed text-[#432918]/80">
                    Línia principal amb parada a Hostalric. És l'opció
                    recomanada per venir en tren a la Fira.
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <a
                  href="https://rodalies.gencat.cat/web/.content/02_Horaris/horaris/R11.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-transparent hover:bg-[#ba5940] text-[#ba5940] hover:text-white font-semibold py-2 px-4 border border-[#ba5940] hover:border-transparent rounded-full transition-colors text-sm cursor-pointer"
                >
                  Consultar horaris R11
                  <span className="material-symbols-outlined text-base">
                    &#xe89e;
                  </span>
                </a>
              </div>
            </div>

            {/* CARD R2 AMB IMATGE LOGOTIP */}
            <div className="border border-[#432918]/20 p-6 rounded-2xl bg-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={r2Logo}
                  alt="Logotip R2 Rodalies"
                  className="w-16 h-16 object-contain rounded-xl shadow-xs shrink-0"
                />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#ba5940] mb-0.5">
                    Horari limitat
                  </p>
                  <h3 className="text-xl font-serif font-bold mb-1">
                    Barcelona Sants ↔ Maçanet-Massanes
                  </h3>
                  <p className="text-sm leading-relaxed text-[#432918]/80">
                    Aquesta línia passa per Hostalric únicament al matí, a la
                    tarda o a la nit — pràcticament fora de l'horari de la Fira.
                    No és l'opció recomanada.
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <a
                  href="https://rodalies.gencat.cat/web/.content/02_Horaris/horaris/R2.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-transparent hover:bg-[#ba5940] text-[#ba5940] hover:text-white font-semibold py-2 px-4 border border-[#ba5940] hover:border-transparent rounded-full transition-colors text-sm cursor-pointer"
                >
                  Consultar horaris R2
                  <span className="material-symbols-outlined text-base">
                    &#xe89e;
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* BUS */}
        {tabActiva === "bus" && (
          <div className="space-y-6 text-justify">
            <h2 className="text-3xl font-serif font-bold mb-5 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ba5940] text-3xl">
                <FaBus />
              </span>
              Bus
            </h2>

            <div className="bg-[#ba5940]/10 border-l-4 border-[#ba5940] p-4 rounded-r-lg mb-8">
              <p className="text-base font-bold text-[#ba5940]">
                Horaris subjectes a modificacions. Consulteu{" "}
                <a
                  href="https://www.teisa-bus.com/ca/rutes"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:opacity-70 transition-opacity"
                >
                  teisa-bus.com
                </a>
              </p>
            </div>

            {[
              {
                linia: "Línia 55",
                ruta: "Sant Hilari – Girona (per Mallorquines) / Breda – Girona (per AP-7)",
                url: "https://drive.google.com/file/d/1y32QwbnFJ66xF-6SPe13uJvyQfsxOZxB/view?usp=sharing",
              },
              {
                linia: "Línia 66",
                ruta: "Breda – Riells – Hostalric – Maçanet – Vidreres – Santa Coloma de Farners",
                url: "https://drive.google.com/file/d/18eGS7FFtWgAg0omPu0qtcq-aHDZoYgmZ/view?usp=sharing",
              },
              {
                linia: "Línia 77",
                ruta: "Hostalric – Sant Hilari Sacalm – Vic",
                url: "https://drive.google.com/file/d/1Aaten1WdPrKLLs3tm-kx4NgeaAIh6xwu/view?usp=sharing",
              },
            ].map((b) => (
              <div
                key={b.linia}
                className="border border-[#432918]/20 p-6 rounded-2xl bg-white/50"
              >
                <h3 className="text-xl font-serif font-bold mb-1">
                  {b.linia} · Teisa
                </h3>
                <p className="text-base text-[#432918]/80 mb-4">{b.ruta}</p>

                <a
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-transparent hover:bg-[#ba5940] text-[#ba5940] hover:text-white font-semibold py-2 px-4 border border-[#ba5940] hover:border-transparent rounded-full transition-colors text-sm cursor-pointer"
                >
                  Consultar horaris
                  <span className="material-symbols-outlined text-base">
                    &#xe89e;
                  </span>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* AUTOCARAVANA */}
        {tabActiva === "autocaravana" && (
          <div className="space-y-6 text-justify">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-5 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ba5940] text-2xl sm:text-3xl">
                  <FaCaravan />
                </span>
                Aparcament per autocaravanes
              </h2>
              <p className="text-lg leading-relaxed mb-4">
                L'Ajuntament d'Hostalric habilitarà una zona d'aparcament per
                autocaravanes (sense serveis) a la zona esportiva.
              </p>
              <div className="bg-[#ba5940]/10 border-l-4 border-[#ba5940] p-4 rounded-r-lg mb-8">
                <p className="text-base font-bold text-[#ba5940]">
                  Les places són limitades i s'assignaran per rigorós ordre
                  d'inscripció.
                </p>
              </div>

              {/* estat de les reserves segons l'aparcament actiu */}
              {loadingAparcament ? (
                <p className="text-[#432918]/60 text-sm">
                  Comprovant disponibilitat...
                </p>
              ) : !aparcamentActiu?.obert ? (
                <div className="bg-[#432918]/7 border border-[#432918]/20 p-6 rounded-2xl text-center">
                  <span className="material-symbols-outlined text-4xl text-[#432918]/30 mb-3 block">
                    &#xe88e;
                  </span>
                  <p className="text-xl font-serif font-bold text-[#432918]/70">
                    Les reserves estan tancades en aquest moment.
                  </p>
                  <p className="text-sm text-[#432918]/50 mt-2">
                    Torna a consultar aquesta pàgina més endavant.
                  </p>
                </div>
              ) : (
                <>
                  {errors.general && (
                    <p className="text-red-500 text-xs mb-4">
                      {errors.general}
                    </p>
                  )}
                  <div className="bg-white/50 border border-[#432918]/20 rounded-2xl p-2 mb-6">
                    <p className="text-sm font-bold text-[#432918]/60 uppercase tracking-wider mb-3">
                      Període disponible
                    </p>
                    <div className="flex gap-6">
                      <div>
                        <p className="text-xs text-[#432918]/50 uppercase tracking-wider">
                          Arribada
                        </p>
                        <p className="font-bold text-[#432918] text-base">
                          {new Date(
                            aparcamentActiu.aparcament.data_inici,
                          ).toLocaleDateString("ca-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#432918]/50 uppercase tracking-wider">
                          Sortida
                        </p>
                        <p className="font-bold text-[#432918] text-base">
                          {new Date(
                            aparcamentActiu.aparcament.data_final,
                          ).toLocaleDateString("ca-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleObrirModal}
                    className="bg-[#ba5940] hover:bg-[#432918] text-white font-semibold py-3 px-8 rounded-full transition-colors flex items-center gap-2 shadow-md w-full sm:w-auto justify-center cursor-pointer"
                  >
                    {user
                      ? "Inscriviu-vos a l'aparcament"
                      : "Inicia sessió per inscriure't"}
                    <span className="material-symbols-outlined text-base">
                      &#xe163;
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL FORMULARI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
              isClosing ? "opacity-0" : "opacity-100"
            }`}
            onClick={() => estatEnviament !== "loading" && tancaModal()}
          />

          <div
            className={`relative bg-[#fdfaf3] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-[#432918]/10 p-6 sm:p-10 ${
              isClosing
                ? "animate-[fadeOut_0.2s_ease-in_forwards]"
                : "animate-[fadeIn_0.2s_ease-out]"
            }`}
          >
            <button
              onClick={tancaModal}
              disabled={estatEnviament === "loading"}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 text-[#432918]/40 hover:text-[#ba5940] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-3xl font-bold">
                &#xe5cd;
              </span>
            </button>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-8 text-center text-[#432918] pr-8 sm:pr-0">
              Inscripció a l'aparcament d'autocaravanes
            </h2>

            {errors.general && (
              <p className="text-red-500 text-xs mb-4 text-center">
                {errors.general}
              </p>
            )}

            <form
              className="space-y-6 flex flex-col w-full text-justify"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 items-start">
                {/* MARCA */}
                <div>
                  <label
                    htmlFor="marca"
                    className="block text-sm font-bold mb-2"
                  >
                    Marca <span className="text-red-500">*</span>
                  </label>
                  {isAltreMarca ? (
                    <div className="relative w-full">
                      <input
                        type="text"
                        id="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        onFocus={netejarError}
                        disabled={estatEnviament !== "idle"}
                        className={inputClass("marca")}
                        placeholder="Escriviu la marca"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsAltreMarca(false);
                          setFormData((prev) => ({ ...prev, marca: "" }));
                        }}
                        disabled={estatEnviament !== "idle"}
                        className="absolute right-3 top-0 bottom-0 h-full flex items-center justify-center text-[#432918]/40 hover:text-[#ba5940] transition-colors disabled:opacity-60 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-2xl font-bold">
                          &#xe5cd;
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full">
                      <select
                        id="marca"
                        value={formData.marca}
                        onChange={handleMarcaSelectChange}
                        onFocus={netejarError}
                        disabled={estatEnviament !== "idle"}
                        className={
                          inputClass("marca") +
                          " appearance-none pr-10 cursor-pointer"
                        }
                      >
                        <option value="" disabled>
                          Selecciona
                        </option>
                        <option value="Adria">Adria</option>
                        <option value="Benimar">Benimar</option>
                        <option value="Bürstner">Bürstner</option>
                        <option value="Carado">Carado</option>
                        <option value="Chausson">Chausson</option>
                        <option value="Dethleffs">Dethleffs</option>
                        <option value="Fiat">Fiat</option>
                        <option value="Ford">Ford</option>
                        <option value="Hymer">Hymer</option>
                        <option value="Iveco">Iveco</option>
                        <option value="Mercedes-Benz">Mercedes-Benz</option>
                        <option value="Pilote">Pilote</option>
                        <option value="Rapido">Rapido</option>
                        <option value="Roller Team">Roller Team</option>
                        <option value="Volkswagen">Volkswagen</option>
                        <option value="Altres">Altres (especificar)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#432918]/50 text-xl pointer-events-none">
                        &#xe5c5;
                      </span>
                    </div>
                  )}
                  {errors.marca && (
                    <p className="text-red-500 text-xs mt-1">{errors.marca}</p>
                  )}
                </div>

                {/* MODEL */}
                <div>
                  <label
                    htmlFor="model"
                    className="block text-sm font-bold mb-2"
                  >
                    Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="model"
                    value={formData.model}
                    onChange={handleChange}
                    onFocus={netejarError}
                    disabled={estatEnviament !== "idle"}
                    className={inputClass("model")}
                    placeholder="El vostre model"
                  />
                  {errors.model && (
                    <p className="text-red-500 text-xs mt-1 text-center md:text-left">
                      {errors.model}
                    </p>
                  )}
                </div>

                {/* MATRÍCULA */}
                <div>
                  <label
                    htmlFor="matricula"
                    className="block text-sm font-bold mb-2"
                  >
                    Matrícula <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="matricula"
                    value={formData.matricula}
                    onChange={handleChange}
                    onFocus={netejarError}
                    disabled={estatEnviament !== "idle"}
                    className={inputClass("matricula")}
                    placeholder="La vostra matrícula"
                  />
                  {errors.matricula && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.matricula}
                    </p>
                  )}
                </div>

                {/* PROCEDÈNCIA */}
                <div>
                  <label
                    htmlFor="procedencia"
                    className="block text-sm font-bold mb-2"
                  >
                    Procedència <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="procedencia"
                    value={formData.procedencia}
                    onChange={handleChange}
                    onFocus={netejarError}
                    disabled={estatEnviament !== "idle"}
                    className={inputClass("procedencia")}
                    placeholder="La vostra procedència"
                  />
                  {errors.procedencia && (
                    <p className="text-red-500 text-xs mt-1 text-center md:text-left">
                      {errors.procedencia}
                    </p>
                  )}
                </div>

                {/* PERSONES + DATES */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6 items-start">
                  <div>
                    <label
                      htmlFor="totalPersones"
                      className="block text-sm font-bold mb-2"
                    >
                      Total de persones <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="totalPersones"
                      value={formData.totalPersones}
                      onChange={handleChange}
                      onFocus={netejarError}
                      disabled={estatEnviament !== "idle"}
                      min="1"
                      className={inputClass("totalPersones")}
                    />
                    {errors.totalPersones && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.totalPersones}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="dataArribada"
                      className="block text-sm font-bold mb-2"
                    >
                      Data d'arribada <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="dataArribada"
                      value={formData.dataArribada}
                      onChange={handleChange}
                      onFocus={netejarError}
                      disabled={estatEnviament !== "idle"}
                      className={inputClass("dataArribada")}
                    />
                    {errors.dataArribada && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.dataArribada}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="dataSortida"
                      className="block text-sm font-bold mb-2"
                    >
                      Data de sortida <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="dataSortida"
                      value={formData.dataSortida}
                      onChange={handleChange}
                      onFocus={netejarError}
                      disabled={estatEnviament !== "idle"}
                      className={inputClass("dataSortida")}
                    />
                    {errors.dataSortida && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.dataSortida}
                      </p>
                    )}
                  </div>
                </div>

                {/* TERMES */}
                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <input
                      type="checkbox"
                      id="acceptoTermes"
                      checked={formData.acceptoTermes}
                      onChange={handleChange}
                      disabled={estatEnviament !== "idle"}
                      className="h-5 w-5 border border-[#432918]/20 rounded bg-white text-[#ba5940] focus:ring-[#ba5940] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    />
                    <label
                      htmlFor="acceptoTermes"
                      className={`text-base cursor-pointer ${errors.acceptoTermes ? "text-red-500" : "text-[#432918]"}`}
                    >
                      Accepto els termes i condicions{" "}
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                  {errors.acceptoTermes && (
                    <p className="text-red-500 text-xs mt-1 text-center md:text-left">
                      {errors.acceptoTermes}
                    </p>
                  )}
                </div>
              </div>

              {/* BOTÓ SUBMIT */}
              <div className="flex justify-end mt-12 w-full">
                <button
                  type="submit"
                  disabled={estatEnviament !== "idle"}
                  className={`text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 flex items-center gap-2 shadow-md w-full sm:w-auto justify-center ${
                    estatEnviament === "success"
                      ? "bg-green-600"
                      : estatEnviament === "espera"
                        ? "bg-yellow-500"
                        : estatEnviament === "loading"
                          ? "bg-[#ba5940]/70 cursor-wait"
                          : "bg-[#ba5940] hover:bg-[#432918] cursor-pointer"
                  }`}
                >
                  {estatEnviament === "idle" && (
                    <>
                      Enviar inscripció{" "}
                      <span className="material-symbols-outlined text-base">
                        &#xe163;
                      </span>
                    </>
                  )}
                  {estatEnviament === "loading" && (
                    <>
                      Processant...
                      <svg
                        className="animate-spin h-5 w-5"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </>
                  )}
                  {estatEnviament === "success" && (
                    <>
                      Inscripció confirmada{" "}
                      <span className="material-symbols-outlined text-xl">
                        &#xe86c;
                      </span>
                    </>
                  )}
                  {estatEnviament === "espera" && (
                    <>
                      Reserva en llista d'espera{" "}
                      <span className="material-symbols-outlined text-xl">
                        &#xe86c;
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.95) translateY(10px); }
        }
      `}</style>
    </div>
  );
}

export default InfoPractica;
