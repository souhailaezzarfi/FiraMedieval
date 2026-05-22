import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Marquee from "../components/Marquee";
import MasonryGallery from "../components/MasonryGallery";
import hero from "../assets/hero.jpg";
import castell from "../assets/cards/Castell-Hostalric.jpg";
import mercat from "../assets/cards/mercat.jpeg";
import torre from "../assets/cards/torre-fares.webp";
import espectacles from "../assets/cards/espectacles.png";

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      img: espectacles,
      titulo: "Espectacles",
      descripcio:
        "Bruixes, dracs i malabaristes il·luminen la nit amb espectacles uniques que et deixaran sense paraules.",
    },
    {
      img: mercat,
      titulo: "Gran Mercat Medieval",
      descripcio:
        "Artesania, gastronomia i productes locals repartits per la Via Romana, la plaça de la Vila i els carrers de la vila emmurallada.",
    },
    {
      img: castell,
      titulo: "El Castell d’Hostalric",
      position: "center center",
      descripcio:
        "Des d'un antic volcà, aquesta fortalesa dels vescomtes de Cabrera va protegir el camí entre Girona i Barcelona durant segles.",
      reservaUrl: "https://www.turismehostalric.cat/ca/",
    },
    {
      img: torre,
      titulo: "La torre dels frares",
      position: "center top",
      descripcio:
        "L'emblema medieval d'Hostalric. Amb 33m d'alçada, ofereix tres plantes d'exposició i un mirador únic sobre la roca.",
      preu: "2€ · Gratuït fins als 12 anys",
    },
  ];

  return (
    <div className="w-full text-[#432918] bg-[#f7f2e8]">
      <section className="relative h-[95vh] w-full flex items-center bg-[#461615] text-white py-12 md:py-0">
        <div className="max-w-400 mx-auto w-full grid md:grid-cols-2 px-6 sm:px-8 md:px-16 lg:px-24 h-full justify-items-center items-center">
          {/* COLUMNA ESQUERRA */}
          <div className="flex flex-col text-center items-center md:text-left md:items-start justify-center h-full mt-4 md:mt-0 md:justify-self-end md:mr-12 lg:mr-16">
            <div className="hidden md:block w-180 h-1 bg-[#EAD9B0] mb-6 rounded"></div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight">
              XXIX FIRA MEDIEVAL D'HOSTALRIC
            </h1>

            <h2 className="font-serif text-2xl md:text-4xl font-bold mb-2 text-[#EAD9B0]">
              3 al 5 d'abril del 2026
            </h2>

            <span className="text-xs uppercase tracking-widest bg-[#EAD9B0]/20 border border-[#EAD9B0]/40 text-[#EAD9B0] px-4 py-1 rounded-full mb-6 md:mb-4">
              Hostalric · Catalunya
            </span>

            <div className="hidden md:block max-w-xl">
              <p className="text-xl md:text-2xl font-bold mb-5">
                Viatgeu a l'època medieval!
              </p>
              <p className="text-base md:text-lg leading-relaxed mb-2">
                Hostalric acull una nova edició de la Fira Medieval, un
                esdeveniment que reviu l'esplendor històric del municipi, que va
                ser la capital del Vescomtat de Cabrera.
              </p>
              <p className="text-base md:text-lg leading-relaxed mb-1">
                Durant tres dies, podreu gaudir d'un gran mercat, així com
                d'espectacles i activitats que us transportaran a l'edat
                mitjana!
              </p>
              <Link
                to="/activitats"
                className="bg-[#EAD9B0] text-[#461615] font-semibold mt-5 py-3 px-6 rounded-full hover:scale-110 transition-transform inline-block"
              >
                Descobriu les activitats
              </Link>
            </div>
          </div>

          {/* COLUMNA DRETA */}
          <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 md:mt-0 h-full max-w-full overflow-hidden md:justify-self-start md:ml-12 lg:ml-16">
            <div className="relative w-full aspect-square md:aspect-auto md:w-200 md:h-150 rounded-3xl overflow-hidden shadow-2xl animate-fade-up max-w-[calc(100%-100px)] sm:max-w-none">
              <img
                src={hero}
                alt="foto"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col items-start gap-4 sm:gap-6 h-full justify-center md:ml-8 shrink-0">
              <div className="fade-right">
                <p className="text-2xl sm:text-3xl font-serif font-bold leading-none">
                  100%
                </p>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#EAD9B0]/70 mt-1">
                  Medieval
                </p>
              </div>
              <div className="w-12 sm:w-18 h-px bg-[#EAD9B0]/30"></div>
              <div className="fade-right-delay-1">
                <p className="text-2xl sm:text-3xl font-serif font-bold leading-none">
                  100%
                </p>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#EAD9B0]/70 mt-1">
                  Experiència
                </p>
              </div>
              <div className="w-12 sm:w-18 h-px bg-[#EAD9B0]/30"></div>
              <div className="fade-right-delay-2">
                <p className="text-2xl sm:text-3xl font-serif font-bold leading-none">
                  3
                </p>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#EAD9B0]/70 mt-1">
                  Dies de festa
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:hidden text-center items-center justify-center max-w-xl px-2">
            <p className="text-xl font-bold mb-4">
              Viatgeu a l'època medieval!
            </p>
            <p className="text-base leading-relaxed mb-3">
              Hostalric acull una nova edició de la Fira Medieval, un
              esdeveniment que reviu l'esplendor històric del municipi, que va
              ser la capital del Vescomtat de Cabrera.
            </p>
            <p className="text-base leading-relaxed mb-5">
              Durant tres dies, podreu gaudir d'un gran mercat, així com
              d'espectacles i activitats que us transportaran a l'edat mitjana!
            </p>
            <Link
              to="/activitats"
              className="bg-[#EAD9B0] text-[#461615] font-semibold py-3 px-8 rounded-full hover:scale-110 transition-transform inline-block w-fit"
            >
              Descobriu les activitats
            </Link>
          </div>
        </div>
        <div className="md:flex absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-[#EAD9B0] text-sm flex flex-col items-center">
          <span>Scroll</span>
          <span>↓</span>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee />

      <section className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#ba5940] font-semibold">
              Per què venir
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#432918] mt-3">
              Descobreix la Fira Medieval
            </h2>
            <p className="text-base md:text-lg text-[#6b4a2b] mt-4 max-w-2xl mx-auto">
              Tres dies d'espectacles, mercat, gastronomia i activitats per a
              tota la família al cor de la vila emmurallada d'Hostalric.
            </p>
            <div className="w-20 h-1 bg-[#d7b731] mx-auto mt-6 rounded"></div>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 cursor-pointer"
              >
                {/* Foto */}
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={item.img}
                    alt={item.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ objectPosition: item.position || "center" }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#432918]/60 to-transparent" />
                  <span className="absolute top-4 right-4 text-3xl"></span>
                </div>

                {/* Text */}
                <div className="p-7">
                  <h3 className="text-xl font-bold text-[#432918] mb-3">
                    {item.titulo}
                  </h3>
                  <p className="text-base text-[#6b4a2b] leading-relaxed mb-4">
                    {item.descripcio}
                  </p>
                   {item.preu && (
                    <span className="inline-block bg-[#d7b731]/20 text-[#8a6e00] text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-[#d7b731]/40">
                      {item.preu}
                    </span>
                  )}
                  {item.reservaUrl ? (
                    <a
                      href={item.reservaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-[#ba5940] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#9e4530] transition-colors"
                    >
                      Reserva ara
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section>
        <MasonryGallery />
      </section>

      {/* VIDEO */}
      <section>
        <div className="max-w-7xl mx-auto text-justify px-4 md:px-0">
          <div className="flex justify-center mt-2 mb-10"></div>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-center text-[#432918] tracking-wide">
            Reviu l'última edició
          </h3>
          <div className="w-20 h-1 bg-[#d7b731] mx-auto mt-6 rounded"></div>

          <div className="w-full mt-12 pb-20">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <iframe
                className="w-full aspect-video"
                src="https://www.youtube.com/embed/8qK-ztxb1G4?rel=0&modestbranding=1&autohide=1&quality=1080p"
                title="Fira Medieval d'Hostalric 2025"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
