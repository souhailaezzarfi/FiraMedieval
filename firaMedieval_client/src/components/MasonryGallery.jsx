// components/MasonryGallery.jsx
import { useState } from "react";
import castell from "../assets/cards/Castell-Hostalric.jpg";
import mercat from "../assets/cards/mercat.jpeg";
import torre from "../assets/cards/torre-fares.webp";
import hero from "../assets/hero.jpg";

const photos = [
  { img: castell, title: "Castell d'Hostalric", span: "row-span-2" },
  { img: mercat, title: "Gran Mercat Medieval", span: "" },
  { img: hero, title: "La Fira", span: "" },
  { img: torre, title: "Torre dels Frares", span: "row-span-2" },
  { img: mercat, title: "Artesania", span: "" },
  { img: castell, title: "Vila Emmurallada", span: "" },
  { img: hero, title: "Espectacles", span: "" },
  { img: torre, title: "Exposicions", span: "" },
  { img: mercat, title: "Gastronomia", span: "" },
  { img: castell, title: "Productes Locals", span: "" },
];

export default function MasonryGallery() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="py-24 bg-[#461615]">
      {/* Título */}
      <div className=" max-w-7xl mx-auto text-center mb-14">
        <span className="text-xs uppercase tracking-widest text-[#EAD9B0]/60 font-semibold">
          Moments
        </span>
        <h2 className="text-5xl font-serif font-bold text-[#EAD9B0] mt-3">
          Galeria de la Fira
        </h2>
        <div className="w-20 h-1 bg-[#d7b731] mx-auto mt-6 rounded" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          style={{ gridAutoRows: "200px" }}
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              onClick={() => setSelected(photo)}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${photo.span}`}
            >
              <img
                src={photo.img}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay hover */}
              <div className="absolute inset-0 bg-[#461615]/0 group-hover:bg-[#461615]/50 transition-all duration-300 flex items-end p-4">
                <span className="text-[#EAD9B0] font-serif text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  {photo.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.img}
              alt={selected.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
            <p className="text-[#EAD9B0] font-serif text-xl text-center mt-4">
              {selected.title}
            </p>
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-[#EAD9B0] text-[#461615] font-bold text-lg flex items-center justify-center hover:scale-110 transition-transform"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
