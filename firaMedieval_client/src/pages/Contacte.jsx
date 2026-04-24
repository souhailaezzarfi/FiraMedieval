function Contacte() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-[#432918]">
      <h1 className="text-5xl md:text-5xl font-serif font-bold text-center mb-12">
        Contacte
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 text-justify">
        <div className="flex flex-col justify-between h-full gap-8">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-5 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ba5940] text-3xl">
                &#xe88a;
              </span>
              Oficina de Turisme
            </h2>
            <p className="text-lg leading-relaxed mb-8">
              Per resoldre qualsevol dubte que tingueu, podeu adreçar-vos a
              l'Oficina de Turisme del municipi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#ba5940]/5 border border-[#ba5940]/20 p-6 rounded-2xl">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#ba5940] mt-0.5">
                    &#xe0c8;
                  </span>
                  <div className="flex flex-col gap-1.2 text-base">
                    <span className="font-bold mb-1.5">
                      La Domus - Can Llensa
                    </span>
                    <span className="font-normal">Carrer Raval, 45</span>
                    <span className="font-normal">17450 Hostalric</span>
                    <span className="font-normal">Girona</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ba5940]">
                    &#xe0b0;
                  </span>
                  <a
                    href="tel:972874165"
                    className="font-bold hover:text-[#ba5940] transition-colors"
                  >
                    972 87 41 65
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ba5940]">
                    &#xe32c;
                  </span>
                  <a
                    href="tel:685882849"
                    className="font-bold hover:text-[#ba5940] transition-colors"
                  >
                    685 88 28 49
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ba5940]">
                    &#xe158;
                  </span>
                  <a
                    href="mailto:turisme@hostalric.cat"
                    className="font-bold hover:text-[#ba5940] transition-colors"
                  >
                    turisme@hostalric.cat
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-serif font-bold mb-5 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ba5940] text-3xl">
                &#xe192;
              </span>
              Horaris d'atenció
            </h2>

            <div className="bg-[#ba5940]/5 border border-[#ba5940]/20 p-6 rounded-2xl flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#ba5940] mt-0.5">
                  &#xe838;
                </span>
                <p className="text-base">
                  <strong className="text-[#432918]">De l'1/11 al 28/02</strong>
                  <br />
                  Dilluns a diumenge: 10:00h - 14:00h
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#ba5940] mt-0.5">
                  &#xe838;
                </span>
                <p className="text-base">
                  <strong className="text-[#432918]">
                    De l'1/03 al 30/06 i 11/09 al 31/10
                  </strong>
                  <br />
                  Dilluns a diumenge: 10:00h - 14:00h
                  <br />
                  Dissabte tarda: 15:00h - 18:00h
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#ba5940] mt-0.5">
                  &#xe838;
                </span>
                <p className="text-base">
                  <strong className="text-[#432918]">De l'1/07 al 10/09</strong>
                  <br />
                  Dilluns a dissabte: 10:00h - 14:00h i 16:00h - 19:00h
                  <br />
                  Diumenge: 10:00h - 14:00h
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-full">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#432918]/10 h-full flex flex-col">
            <h2 className="text-3xl font-serif font-bold mb-8 text-[#ba5940] flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl">
                &#xe0d0;
              </span>
              Contacteu amb nosaltres
            </h2>

            <form
              className="space-y-6 flex flex-col flex-1"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="nom" className="block text-sm font-bold mb-2">
                    Nom i cognoms
                  </label>
                  <input
                    type="text"
                    id="nom"
                    className="w-full px-4 py-3 border border-[#432918]/20 rounded-lg focus:outline-none focus:border-[#ba5940] focus:ring-1 focus:ring-[#ba5940] transition-all bg-[#fdfaf3]/50"
                    placeholder="El vostre nom complet"
                  />
                </div>

                <div>
                  <label
                    htmlFor="telefon"
                    className="block text-sm font-bold mb-2"
                  >
                    Telèfon
                  </label>
                  <input
                    type="tel"
                    id="telefon"
                    className="w-full px-4 py-3 border border-[#432918]/20 rounded-lg focus:outline-none focus:border-[#ba5940] focus:ring-1 focus:ring-[#ba5940] transition-all bg-[#fdfaf3]/50"
                    placeholder="El vostre número de telèfon"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold mb-2"
                  >
                    Correu electrònic
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-[#432918]/20 rounded-lg focus:outline-none focus:border-[#ba5940] focus:ring-1 focus:ring-[#ba5940] transition-all bg-[#fdfaf3]/50"
                    placeholder="La vostra adreça de correu"
                  />
                </div>

                <div>
                  <label
                    htmlFor="missatge"
                    className="block text-sm font-bold mb-2"
                  >
                    Missatge
                  </label>
                  <textarea
                    id="missatge"
                    rows="6"
                    className="w-full px-4 py-3 border border-[#432918]/20 rounded-lg focus:outline-none focus:border-[#ba5940] focus:ring-1 focus:ring-[#ba5940] transition-all bg-[#fdfaf3]/50 resize-none"
                    placeholder="Com us podem ajudar?"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end mt-auto pt-6">
                <button
                  type="submit"
                  className="bg-[#ba5940] hover:bg-[#432918] text-white font-semibold py-3 px-8 rounded-full transition-colors flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
                >
                  Enviar missatge
                  <span className="material-symbols-outlined text-base">
                    &#xe163;
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacte;
