import logoAjuntament from "../assets/logos/ajuntament-hostalric.png";
import logoTurisme from "../assets/logos/turisme-hostalric.png";
import logoVescomtat from "../assets/logos/vescomtat-cabrera.png";

function Footer() {
  return (
    <footer className="bg-[#D3C49C] border-t-2 border-[#432918] py-4">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-items-center">
        <a
          href="https://www.hostalric.cat"
          target="_blank"
          className="hover:opacity-75 transition-opacity"
        >
          <img
            src={logoAjuntament}
            alt="Ajuntament d'Hostalric"
            className="h-16 max-w-45 object-contain"
          />
        </a>

        <a
          href="https://www.turismehostalric.cat"
          target="_blank"
          className="hover:opacity-75 transition-opacity"
        >
          <img
            src={logoTurisme}
            alt="Turisme d'Hostalric"
            className="h-16 max-w-45 object-contain"
          />
        </a>

        <a
          href="https://www.turismehostalric.cat/ca/hostalric-capital-del-vescomtat-de-cabrera/"
          target="_blank"
          className="hover:opacity-75 transition-opacity"
        >
          <img
            src={logoVescomtat}
            alt="Vescomtat de Cabrera"
            className="h-16 max-w-45 object-contain"
          />
        </a>
      </div>

      <div className="text-center text-sm text-[#432918] mt-4 font-sans">
        © 2026 Ajuntament d'Hostalric
      </div>
    </footer>
  );
}

export default Footer;
