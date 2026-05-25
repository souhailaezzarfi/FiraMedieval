import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import logoAjuntament from "../assets/logos/ajuntament-hostalric.png";
import logoTurisme from "../assets/logos/turisme-hostalric.png";
import logoVescomtat from "../assets/logos/vescomtat-cabrera.png";

function Footer() {
  return (
    <footer className="bg-[#E8D1A7] text-[#432918] border-t-2 border-[#432918]">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/*Identitat */}
        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-2xl font-bold text-[#432918]">
            Fira Medieval d'Hostalric
          </h3>
          <p className="text-sm text-[#432918]/80 leading-relaxed">
            Cada any, Hostalric reviu l'esplendor medieval del Vescomtat de
            Cabrera. Tres dies d'història, cultura i festa per a tothom.
          </p>
          {/* Redes sociales */}
          <div className="flex gap-3 mt-2">
            <a
              href="https://www.instagram.com/visitahostalric/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-[#EAD9B0]/30 flex items-center justify-center text-[#432918]/70 hover:border-[#461615] hover:text-[#461615] transition-all text-sm font-bold"
            >
              <FaInstagram className="text-3xl text-[#432918] transition-colors" />
            </a>
            <a
              href="https://www.facebook.com/visitahostalric/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-[#EAD9B0]/30 flex items-center justify-center text-[#432918]/70 hover:border-[#461615] hover:text-[#461615] transition-all text-sm font-bold"
            >
              <FaFacebook className="text-3xl text-[#432918] transition-colors" />
            </a>
            <a
              href="https://youtube.com/@hostalricturisme4208?si=mdEU2oprmsv-981-"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-[#EAD9B0]/30 flex items-center justify-center text-[#432918]/70 hover:border-[#461615] hover:text-[#461615] transition-all text-sm font-bold"
            >
              <FaYoutube className="text-3xl text-[#432918] transition-colors" />
            </a>
          </div>
        </div>

        {/* Navegació */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs uppercase tracking-widest text-[#461615] font-semibold mb-2">
            Navegació
          </h4>
          {[
            { label: "Inici", to: "/" },
            { label: "Activitats", to: "/activitats" },
            { label: "Informació pràctica", to: "/info-practica" },
            { label: "Contacte", to: "/contacte" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-[#432918]/80 hover:text-[#461615] transition-colors w-fit"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Organitzadors */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-widest text-[#461615] font-semibold mb-2">
            Organitzadors
          </h4>
          <div className="flex flex-col gap-4">
            <a
              href="https://www.hostalric.cat"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity w-fit"
            >
              <img
                src={logoAjuntament}
                alt="Ajuntament d'Hostalric"
                className="h-15"
              />
            </a>
            <a
              href="https://www.turismehostalric.cat"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity w-fit"
            >
              <img
                src={logoTurisme}
                alt="Turisme d'Hostalric"
                className="h-10 "
              />
            </a>
            <a
              href="https://www.turismehostalric.cat/ca/hostalric-capital-del-vescomtat-de-cabrera/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity w-fit"
            >
              <img
                src={logoVescomtat}
                alt="Vescomtat de Cabrera"
                className="h-15"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#EAD9B0]/15 py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#432918]/70">
          <span>© 2026 Ajuntament d'Hostalric. Tots els drets reservats.</span>
          <span>Fira Medieval d'Hostalric · XXIX Edició</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
