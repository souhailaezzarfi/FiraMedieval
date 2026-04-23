import { Link } from "react-router-dom";

function InfoPractica() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-[#432918]">
      <h1 className="text-5xl md:text-5xl font-serif font-bold text-center mb-12">
        Informació pràctica
      </h1>

      <div className="max-w-5xl mx-auto text-justify">
        <div className="mb-12">
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
    </div>
  );
}

export default InfoPractica;
