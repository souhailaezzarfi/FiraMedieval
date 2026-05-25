import ADF from "../assets/Agraïments/ADF.png";
import AFACole from "../assets/Agraïments/AFA cole.png";
import ArtisticEvents from "../assets/Agraïments/Artístic Events.png";
import AssociacioComerc from "../assets/Agraïments/Associació comerç.png";
import ClubBitlles from "../assets/Agraïments/Club Bitlles.png";
import ClubPatiHostalric from "../assets/Agraïments/Club Patí Hostalric.jpg";
import ClubHostalric from "../assets/Agraïments/At. Club Hostalric.PNG";
import ComissioFestaMedieval from "../assets/Agraïments/Comissió Festa Medieval.png";
import ComissioPictorica from "../assets/Agraïments/Comissió pictòrica església.png";
import CostaBrava from "../assets/Agraïments/costabrava.png";
import DiputacioGirona from "../assets/Agraïments/DIPUTACIODEGIRONA.png";
import Geganters from "../assets/Agraïments/Geganters-logo.png";
import LofoAfaIns from "../assets/Agraïments/lofo afa ins.png";
import LoveAnimals from "../assets/Agraïments/Love Animals.jpg";
import Majorets from "../assets/Agraïments/Majorets.png";
import ProteccioCivil from "../assets/Agraïments/Protecció Civil.png";
import Puntaires from "../assets/Agraïments/Puntaires.png";
import catalunyaTurisme from "../assets/Agraïments/Catalunya Turisme.jpg";

const marqueeImages = [
  ADF,
  AFACole,
  ArtisticEvents,
  AssociacioComerc,
  ClubBitlles,
  ClubPatiHostalric,
  ClubHostalric,
  ComissioFestaMedieval,
  ComissioPictorica,
  CostaBrava,
  DiputacioGirona,
  Geganters,
  LofoAfaIns,
  LoveAnimals,
  Majorets,
  ProteccioCivil,
  Puntaires,
  catalunyaTurisme,
];

export default function Marquee() {
  const doubled = [...marqueeImages, ...marqueeImages];

  return (
    <section>
      <div className="relative left-1/2 -translate-x-1/2 w-screen overflow-hidden bg-[#EAD9B0] py-4">
        <div className="flex w-max animate-marquee md:animate-marquee whitespace-nowrap [animation-duration:15s] md:[animation-duration:30s]">
          {doubled.map((img, i) => (
            <span key={i} className="mx-6 inline-flex items-center">
              <img
                className="w-auto h-16 object-contain"
                src={img}
                alt={`marca-${i}`}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
