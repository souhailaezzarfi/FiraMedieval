// components/MasonryGallery.jsx
import { useState } from "react";
import galeria1 from "../assets/galeria/galeria1.jpg";
import galeria2 from "../assets/galeria/galeria2.jpg";
import galeria3 from "../assets/galeria/galeria3.jpg";
import galeria4 from "../assets/galeria/galeria4.jpg";
import galeria5 from "../assets/galeria/galeria5.jpg";
import galeria6 from "../assets/galeria/galeria6.jpg";
import galeria7 from "../assets/galeria/galeria7.jpg";
import galeria8 from "../assets/galeria/galeria8.jpg";
import galeria9 from "../assets/galeria/galeria9.jpg";
import galeria10 from "../assets/galeria/galeria10.jpg";

const photos = [
  { img: galeria1, title: "Recreació Medieval", span: "row-span-2" },
  { img: galeria2, title: "Espectacles al Castell", span: "" },
  { img: galeria3, title: "Animació Medieval", span: "" },
  { img: galeria4, title: "Combat Medieval", span: "row-span-2" },
  { img: galeria5, title: "Artesania Medieval", span: "" },
  { img: galeria6, title: "Tir amb Arc", span: "" },
  { img: galeria7, title: "Música Medieval", span: "" },
  { img: galeria8, title: "Combat d'Espases", span: "" },
  { img: galeria9, title: "Activitats Infantils", span: "" },
  { img: galeria10, title: "Exhibició d'Animals", span: "" },
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
