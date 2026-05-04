import { useState, useEffect } from "react";
import { z } from "zod";

const inscripcioSchema = z.object({
  marca: z.string().min(1, "La marca és obligatòria"),
  model: z.string().optional(),
  matricula: z.string().min(1, "La matrícula és obligatòria"),
  procedencia: z.string().optional(),
  totalPersones: z.coerce.number().min(1, "Mínim 1 persona"),
  dataArribada: z.string().min(1, "Data obligatòria"),
  dataSortida: z.string().min(1, "Data obligatòria"),
  acceptoTermes: z.literal(true, {
    errorMap: () => ({ message: "Heu d'acceptar els termes i condicions" }),
  }),
});

function InfoPractica() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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

  // Bloquejar el scroll de la pàgina quan el modal està obert
  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const tancaModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleMarcaSelectChange = (e) => {
    if (e.target.value === "altre") {
      e.target.options[e.target.selectedIndex].text = "";
      setIsAltreMarca(true);
      setFormData((prev) => ({ ...prev, marca: "" }));
      if (errors.marca) {
        setErrors((prev) => ({ ...prev, marca: undefined }));
      }
    } else {
      handleChange(e);
    }
  };

  const netejarError = (e) => {
    const { id } = e.target;
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const resultatValidacio = inscripcioSchema.safeParse(formData);
    const nousErrors = {};

    // 1. Agafem els errors de Zod
    if (!resultatValidacio.success) {
      resultatValidacio.error.issues.forEach((issue) => {
        if (!nousErrors[issue.path[0]]) {
          nousErrors[issue.path[0]] = issue.message;
        }
      });
    }

    // Validació de dates
    if (formData.dataArribada && formData.dataSortida) {
      if (new Date(formData.dataSortida) < new Date(formData.dataArribada)) {
        nousErrors.dataSortida = "Error de dates";
      }
    }

    // Si hi ha errors, no s'envia el formulari
    if (Object.keys(nousErrors).length > 0) {
      setErrors(nousErrors);
      return;
    }

    setErrors({});
    setEstatEnviament("loading");

    setTimeout(() => {
      console.log("Dades d'inscripció a enviar:", formData);
      setEstatEnviament("success");

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
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-[#432918] relative">
      <h1 className="text-5xl md:text-5xl font-serif font-bold text-center mb-12">
        Informació pràctica
      </h1>

      <div className="max-w-5xl mx-auto text-justify">
        <div className="mb-4">
          <h2 className="text-3xl font-serif font-bold mb-5 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ba5940] text-3xl">
              &#xeb3c;
            </span>
            Aparcament per autocaravanes
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            L'Ajuntament d'Hostalric habilitarà una zona d'aparcament per
            autocaravanes (sense serveis) a la zona esportiva.
          </p>

          <div className="bg-[#ba5940]/10 border-l-4 border-[#ba5940] p-4 rounded-r-lg mt-2">
            <p className="text-base font-bold text-[#ba5940]">
              <span className="material-symbols-outlined align-middle mr-2 text-lg">
                &#xe002;
              </span>
              Les places són limitades i s'assignaran per rigorós ordre
              d'inscripció.
            </p>
          </div>
        </div>

        <div className="flex justify-center md:justify-start mb-12">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#ba5940] hover:bg-[#432918] text-white font-semibold 
              py-3 px-8 rounded-full transition-colors flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
          >
            Inscriviu-vos a l'aparcament
            <span className="material-symbols-outlined text-base">
              &#xe163;
            </span>
          </button>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-serif font-bold mb-5 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ba5940] text-3xl">
              &#xe531;
            </span>
            Aparcaments per turismes
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            Per facilitar l'accés a la fira, s'habilitaran aparcaments gratuïts
            en diversos punts del municipi:
          </p>

          <ul className="text-base font-bold space-y-3 mb-8 ml-2">
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#d7b731]">
                &#xe8b4;
              </span>
              Zona esportiva municipal (ZEM)
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#d7b731]">
                &#xe570;
              </span>
              Estació de tren
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#d7b731]">
                &#xe569;
              </span>
              Altres zones habilitades
            </li>
          </ul>

          <div className="border border-[#432918]/20 p-6 rounded-2xl shadow-sm bg-white/50">
            <p className="text-lg leading-relaxed mb-3">
              S'habilitarà un servei de trenet llançadora per facilitar l'accés
              a les persones que aparquin a la{" "}
              <strong>zona esportiva municipal (ZEM)</strong>, podent fer el
              desplaçament fins a la plaça de l'escola, punt d'inici de la Fira,
              amb el trenet d'enllaç.
            </p>
            <p className="text-lg font-bold text-[#ba5940]">
              Aquest servei té un cost de 2€ per trajecte.
            </p>
          </div>
        </div>

        <div className="mt-12 max-w-5xl mx-auto text-justify">
          <p className="text-2xl font-bold text-center mb-5">
            Veniu a gaudir de la Fira Medieval d'Hostalric i descobriu la màgia
            de l'època medieval!
          </p>
          <p className="text-lg leading-relaxed text-center mb-3">
            Aquí podeu consultar el programa de la XXIX Fira Medieval
            d'Hostalric.
          </p>

          <div className="flex justify-center mt-8 mb-10">
            <a
              href="https://www.turismehostalric.cat/wp-content/uploads/2026/03/Versio-mobil-medieval-def.pdf"
              target="_blank"
              rel="noreferrer"
              className="bg-transparent hover:bg-[#ba5940] text-[#ba5940] font-semibold 
              hover:text-white py-2 px-4 border border-[#ba5940] hover:border-transparent rounded-full transition-colors flex items-center gap-2"
            >
              Consulteu el programa
              <span className="material-symbols-outlined text-base">
                &#xe89e;
              </span>
            </a>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
              isClosing ? "opacity-0" : "opacity-100"
            }`}
            onClick={() => estatEnviament !== "loading" && tancaModal()}
          ></div>

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
              className="absolute right-4 top-4 sm:right-6 sm:top-6 text-[#432918]/40 hover:text-[#ba5940] transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-3xl font-bold">
                &#xe5cd;
              </span>
            </button>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-8 text-center text-[#432918] pr-8 sm:pr-0">
              Inscripció a l'aparcament d'autocaravanes
            </h2>

            <form
              className="space-y-6 flex flex-col w-full text-justify"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 items-start">
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
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all bg-white pr-12 disabled:opacity-60 disabled:cursor-not-allowed ${
                          errors.marca
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-[#432918]/20 focus:border-[#ba5940] focus:ring-[#ba5940]"
                        }`}
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
                        className="absolute right-3 top-0 bottom-0 h-full flex items-center justify-center text-[#432918]/40 hover:text-[#ba5940] transition-colors disabled:opacity-60"
                        title="Tornar al llistat de marques"
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
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all bg-white appearance-none pr-10 disabled:opacity-60 disabled:cursor-not-allowed ${
                          errors.marca
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-[#432918]/20 focus:border-[#ba5940] focus:ring-[#ba5940]"
                        }`}
                        required
                      >
                        <option value="" disabled>
                          Selecciona
                        </option>
                        <option value="fiat">Fiat</option>
                        <option value="ford">Ford</option>
                        <option value="iveco">Iveco</option>
                        <option value="volkswagen">Volkswagen</option>
                        <option value="mercedes">Mercedes-Benz</option>
                        <option value="altre">Altres (especificar)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#432918]/50 text-xl pointer-events-none">
                        &#xe5c5;
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="model"
                    className="block text-sm font-bold mb-2"
                  >
                    Model
                  </label>
                  <input
                    type="text"
                    id="model"
                    value={formData.model}
                    onChange={handleChange}
                    onFocus={netejarError}
                    disabled={estatEnviament !== "idle"}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all bg-white disabled:opacity-60 disabled:cursor-not-allowed ${
                      errors.model
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#432918]/20 focus:border-[#ba5940] focus:ring-[#ba5940]"
                    }`}
                    placeholder="El vostre model"
                  />
                </div>

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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all bg-white disabled:opacity-60 disabled:cursor-not-allowed ${
                      errors.matricula
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#432918]/20 focus:border-[#ba5940] focus:ring-[#ba5940]"
                    }`}
                    placeholder="La vostra matrícula"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="procedencia"
                    className="block text-sm font-bold mb-2"
                  >
                    Procedència
                  </label>
                  <input
                    type="text"
                    id="procedencia"
                    value={formData.procedencia}
                    onChange={handleChange}
                    onFocus={netejarError}
                    disabled={estatEnviament !== "idle"}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all bg-white disabled:opacity-60 disabled:cursor-not-allowed ${
                      errors.procedencia
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#432918]/20 focus:border-[#ba5940] focus:ring-[#ba5940]"
                    }`}
                    placeholder="La vostra procedència"
                  />
                </div>

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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all bg-white disabled:opacity-60 disabled:cursor-not-allowed ${
                        errors.totalPersones
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#432918]/20 focus:border-[#ba5940] focus:ring-[#ba5940]"
                      }`}
                      required
                    />
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all bg-white disabled:opacity-60 disabled:cursor-not-allowed ${
                        errors.dataArribada
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#432918]/20 focus:border-[#ba5940] focus:ring-[#ba5940]"
                      }`}
                      required
                    />
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all bg-white disabled:opacity-60 disabled:cursor-not-allowed ${
                        errors.dataSortida
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#432918]/20 focus:border-[#ba5940] focus:ring-[#ba5940]"
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <input
                      type="checkbox"
                      id="acceptoTermes"
                      checked={formData.acceptoTermes}
                      onChange={handleChange}
                      disabled={estatEnviament !== "idle"}
                      className="h-5 w-5 border border-[#432918]/20 rounded bg-white text-[#ba5940] focus:ring-[#ba5940] disabled:opacity-60 disabled:cursor-not-allowed"
                      required
                    />
                    <label
                      htmlFor="acceptoTermes"
                      className={`text-base text-center md:text-left ${
                        errors.acceptoTermes ? "text-red-500" : "text-[#432918]"
                      }`}
                    >
                      Accepto els termes i condicions{" "}
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-12 w-full">
                <button
                  type="submit"
                  disabled={estatEnviament !== "idle"}
                  className={`text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 flex items-center gap-2 shadow-md w-full sm:w-auto justify-center ${
                    estatEnviament === "success"
                      ? "bg-green-600 hover:bg-green-600 cursor-default"
                      : estatEnviament === "loading"
                        ? "bg-[#ba5940]/70 cursor-wait"
                        : "bg-[#ba5940] hover:bg-[#432918]"
                  }`}
                >
                  {estatEnviament === "idle" && (
                    <>
                      Enviar inscripció
                      <span className="material-symbols-outlined text-base">
                        &#xe163;
                      </span>
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

                  {estatEnviament === "success" && (
                    <>
                      Inscripció confirmada
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
