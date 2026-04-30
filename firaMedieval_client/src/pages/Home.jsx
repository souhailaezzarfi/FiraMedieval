import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import hero from "../assets/hero.jpg";
import marquee1 from "../assets/Marquee/InstiVescomtatDeCabrera.png";
import marquee2 from "../assets/Marquee/logocatalunya.png";
import marquee3 from "../assets/logos/turisme-hostalric.png";
import marquee4 from "../assets/logos/vescomtat-cabrera.png";
import marquee5 from "../assets/logos/ajuntament-hostalric.png";
import castell from "../assets/cards/Castell-Hostalric.jpg";
import mercat from "../assets/cards/mercat.jpeg";
import torre from "../assets/cards/torre-fares.webp";

function Home() {
  const features = [
    {
      img: hero,
      titulo: "Espectacles de Foc",
      descripcio:
        "Bruixes, dracs i malabaristes il·luminen la nit amb espectacles únics que et deixaran sense paraules.",
    },
    {
      img: mercat,
      titulo: "Gran Mercat Medieval",
      descripcio:
        "Més de 100 parades d'artesania, gastronomia i productes locals en plena vila emmurallada.",
    },
    {
      img: castell,
      titulo: "El Castell d’Hostalric",
      descripcio:
        "Des d'un antic volcà, aquesta fortalesa dels vescomtes de Cabrera va protegir el camí entre Girona i Barcelona durant segles.",
      reservaUrl: "https://www.turismehostalric.cat/ca/",
    },
    {
      img: torre,
      titulo: "La torre dels frares",
      descripcio:
        "L'emblema medieval d'Hostalric. Amb 33m d'alçada, ofereix tres plantes d'exposició i un mirador únic sobre la roca.",
      preu: "2€ · Gratuït fins als 12 anys",
    },
  ];

  return (
    <div className="w-full text-[#432918] bg-[#f7f2e8]">
      <section className="h-screen w-full flex items-center bg-[#461615] text-white">
        <div className="w-full grid md:grid-cols-2 px-8 md:px-16 lg:px-24 ">
          {/* LEFT */}
          <div className="flex flex-col items-start justify-center -translate-y-10 ">
            <div className="w-180 h-1 bg-[#EAD9B0] mb-4 rounded"></div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-2">
              XXIX FIRA MEDIEVAL D'HOSTALRIC
            </h1>

            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-[#EAD9B0]">
              3 al 5 d'abril del 2026
            </h2>
            <span className="text-xs uppercase tracking-widest bg-[#EAD9B0]/20 border border-[#EAD9B0]/40 text-[#EAD9B0] px-4 py-1 rounded-full mb-4">
              Hostalric · Catalunya
            </span>
            <div className="max-w-xl">
              <p className="text-2xl font-bold mb-5">
                Viatgeu a l'època medieval!
              </p>
              <p className="text-lg leading-relaxed mb-2">
                Hostalric acull una nova edició de la Fira Medieval, un
                esdeveniment que reviu l'esplendor històric del municipi, que va
                ser la capital del Vescomtat de Cabrera.
              </p>
              <p className="text-lg leading-relaxed mb-1">
                Durant tres dies, podreu gaudir d'un gran mercat, així com
                d'espectacles i activitats que us transportaran a l'edat
                mitjana!
              </p>
            </div>

            <Link
              to="/activitats"
              className="bg-[#EAD9B0] text-[#461615] font-semibold mt-5 py-3 px-6 rounded-full hover:scale-110 transition-transform"
            >
              Descobriu les activitats
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-center gap-6">
            <div className="relative w-100 h-100 md:w-200 md:h-150 rounded-3xl overflow-hidden shadow-2xl animate-fade-up">
              <img
                src={hero}
                alt="foto"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col items-start gap-6 h-full justify-center ml-8">
              <div className="fade-right">
                <p className="text-3xl font-serif font-bold leading-none">
                  100%
                </p>
                <p className="text-xs uppercase tracking-widest text-[#EAD9B0]/70 mt-1">
                  Medieval
                </p>
              </div>
              <div
                className="w-18 h-px bg-[#EAD9B0]/30"
                fade-right-delay-1
              ></div>
              <div className="fade-right-delay-1">
                <p className="text-3xl font-serif font-bold leading-none">
                  100%
                </p>
                <p className="text-xs uppercase tracking-widest text-[#EAD9B0]/70 mt-1">
                  Experiència
                </p>
              </div>
              <div
                className="w-18 h-px bg-[#EAD9B0]/30"
                fade-right-delay-2
              ></div>
              <div className="fade-right-delay-2">
                <p className="text-3xl font-serif font-bold leading-none">3</p>
                <p className="text-xs uppercase tracking-widest text-[#EAD9B0]/70 mt-1">
                  Dies de festa
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#EAD9B0] text-sm flex flex-col items-center gap-1">
          <span>Scroll</span>
          <span>↓</span>
        </div>
      </section>

      <div className="relative left-1/2 -translate-x-1/2 w-screen overflow-hidden bg-[#EAD9B0]">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[
            marquee1,
            marquee2,
            marquee3,
            marquee4,
            marquee5,
            marquee1,
            marquee2,
            marquee3,
            marquee4,
            marquee5,
            marquee1,
            marquee2,
            marquee3,
            marquee4,
            marquee5,
          ].map((img, i) => (
            <span key={i} className="mx-6 inline-flex items-center">
              <img className="w-20 h-20 object-contain" src={img} />
            </span>
          ))}
        </div>
      </div>

      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Titol */}
          <div className="text-center mb-20">
            <span className="text-xs uppercase tracking-widest text-[#ba5940] font-semibold">
              Per què venir
            </span>
            <h2 className="text-5xl font-serif font-bold text-[#432918] mt-3">
              Descobreix la Fira Medieval
            </h2>
            <p className="text-lg text-[#6b4a2b] mt-4 max-w-2xl mx-auto">
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
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#432918]/60 to-transparent" />
                  <span className="absolute top-4 right-4 text-3xl"></span>
                </div>

                {/* Text */}
                <div className="p-7">
                  <h3 className="text-xl font-bold text-[#432918] mb-3">
                    {item.titulo}
                  </h3>
                  {item.preu && (
                    <span className="inline-block bg-[#d7b731]/20 text-[#8a6e00] text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-[#d7b731]/40">
                      {item.preu}
                    </span>
                  )}
                  <p className="text-base text-[#6b4a2b] leading-relaxed mb-4">
                    {item.descripcio}
                  </p>
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
      <div className=" max-w-5xl mx-auto text-justify">
        <div className="flex justify-center mt-2 mb-10"></div>
        <h3 className="text-5xl font-serif font-bold text-center text-[#432918] tracking-wide ">
          Reviu l'última edició
        </h3>
        <div className="w-20 h-1 bg-[#d7b731] mx-auto mt-6 rounded"></div>

        <div className="w-full mt-12 pb-20">
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <iframe
              className="w-full aspect-video"
              src="https://www.youtube.com/embed/8qK-ztxb1G4"
              title="Fira Medieval d'Hostalric 2025"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
