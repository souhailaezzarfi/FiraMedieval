import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import hero from "../assets/hero.jpg";

function Home() {
  const imatges = [
    "https://www.turismehostalric.cat/wp-content/uploads/2024/03/358d9-medieval1.jpg",
    "https://www.turismehostalric.cat/wp-content/uploads/2024/03/eb833-Medieval_web-turisme_arquers.png",
    "https://www.turismehostalric.cat/wp-content/uploads/2024/03/33b0b-Medieval_web-turisme_graiatus.png",
    "https://www.turismehostalric.cat/wp-content/uploads/2024/03/7d02d-medieval7.jpg",
    "https://www.turismehostalric.cat/wp-content/uploads/2024/03/4c7c9-medieval6.jpg",
    "https://www.turismehostalric.cat/wp-content/uploads/2024/03/0cfa1-medieval2.jpg",
  ];

  const [index, setIndex] = useState(0);

  const anterior = () => {
    setIndex((prev) => (prev == 0 ? imatges.length - 1 : prev - 1));
  };

  const seguent = () => {
    setIndex((prev) => (prev == imatges.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === imatges.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-[#432918]">
      <h1 className="text-5xl md:text-6xl font-serif font-bold text-center tracking-wide mb-1">
        XXIX FIRA MEDIEVAL D'HOSTALRIC
      </h1>
      <h2 className="font-serif text-4xl font-bold text-center tracking-wide mb-8">
        3 al 5 d'abril del 2026
      </h2>

      <div className="relative mx-auto w-full md:h-110 rounded-2xl overflow-hidden shadow-2xl mb-12 group">
        {imatges.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={img}
              alt={`Fira ${i}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        <button
          onClick={anterior}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10 flex items-center justify-center"
          aria-label="Imatge anterior"
        >
          <span className="material-symbols-outlined text-3xl">&#xe5cb;</span>
        </button>

        <button
          onClick={seguent}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10 flex items-center justify-center"
          aria-label="Imatge següent"
        >
          <span className="material-symbols-outlined text-3xl">&#xe5cc;</span>
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {imatges.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-2 bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-12 max-w-5xl mx-auto text-justify">
        <p className="text-2xl font-bold mb-5">Viatgeu a l'època medieval!</p>
        <p className="text-lg leading-relaxed mb-3">
          Hostalric acull una nova edició de la Fira Medieval, un esdeveniment
          que reviu l'esplendor històric del municipi, que va ser la capital del
          Vescomtat de Cabrera.
        </p>
        <p className="text-lg leading-relaxed mb-3">
          Durant tres dies, podreu gaudir d'un gran mercat, així com
          d'espectacles i activitats que us transportaran a l'edat mitjana!
        </p>

        <div className="flex justify-center mt-8 mb-10">
          <Link
            to="/activitats"
            className="bg-[#461615] hover:bg-[#5a1d1b] text-white font-semibold 
            hover:text-white py-2 px-4 border border-[#461615] hover:border-transparent rounded-full hover:scale-110 transition-transform"
          >
            Descobriu les activitats disponibles
          </Link>
        </div>

        <div className="w-full mt-16 mb-16">
          <h3 className="text-3xl font-serif font-bold text-center text-[#432918] tracking-wide mb-6">
            Reviu l'última edició
          </h3>

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
