/* =====================================================================
   KAISE LAGAYEIN:
   Apni App.jsx mein purana poora `function Hero() { ... }` delete karke
   iska code paste kar dein. Koi naya import nahi chahiye
   (useEffect aur useState pehle se import hain).
   ===================================================================== */

/* ---------- HERO ---------- */
function Hero() {
  const [ready, setReady] = useState(false);

  // Page load par buttons smooth fade + slide-up honge
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const anim = (delay) => ({
    style: { transitionDelay: `${delay}ms` },
    className: `transition-all duration-700 ease-out motion-reduce:transition-none ${
      ready ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
    }`,
  });

  const arrow = (
    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );

  return (
    <section className="relative">
      <div className="relative">
        <img
          src="/Project_main_Image.png"
          alt="Your Perfect Event Starts Here"
          className="block shadow-lg shadow-sky-200/60 rounded-b-3xl sm:rounded-b-[2.5rem] w-full h-auto object-cover"
          fetchPriority="high"
        />

        {/* Halka dark gradient, taaki image par buttons saaf padhe jayein (sirf sm+) */}
        <div
          aria-hidden="true"
          className="hidden sm:block absolute inset-0 bg-gradient-to-tr from-slate-900/40 via-transparent to-transparent rounded-b-[2.5rem] pointer-events-none"
        />

        {/* ===== Tablet / Desktop: buttons image ke upar (left-bottom) ===== */}
        <div className="hidden bottom-[14%] lg:bottom-[16%] left-[6%] absolute sm:flex flex-col gap-4 max-w-[88%]">
          <div {...anim(150)} className={`flex flex-wrap items-center gap-3 ${anim(150).className}`}>
            <a
              href="#plan"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg shadow-sky-500/40 hover:shadow-sky-400/50 hover:shadow-xl px-5 lg:px-7 py-2.5 lg:py-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 font-semibold text-white text-sm lg:text-base transition hover:-translate-y-0.5 duration-300"
            >
              Plan My Event
              {arrow}
            </a>
            <a
              href="#vendors"
              className="group inline-flex items-center gap-2 bg-white/15 hover:bg-white backdrop-blur-md px-5 lg:px-7 py-2.5 lg:py-3 rounded-full focus:outline-none ring-1 ring-white/50 focus-visible:ring-2 focus-visible:ring-white font-semibold text-white hover:text-sky-800 text-sm lg:text-base transition hover:-translate-y-0.5 duration-300"
            >
              <span aria-hidden="true">📸</span>
              Explore Vendors
            </a>
          </div>

          {/* Trust chip: sirf md+ par */}
          <div {...anim(300)} className={`hidden items-center gap-3 md:flex ${anim(300).className}`}>
            <div className="flex -space-x-2" aria-hidden="true">
              {[
                ["PS", "from-rose-300 to-pink-400"],
                ["RM", "from-sky-300 to-blue-400"],
                ["NV", "from-amber-300 to-orange-400"],
                ["AS", "from-violet-300 to-fuchsia-400"],
              ].map(([t, g]) => (
                <span key={t} className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white ring-2 ring-white/80 ${g}`}>
                  {t}
                </span>
              ))}
            </div>
            <p className="bg-black/25 backdrop-blur-sm px-3 py-1 rounded-full font-medium text-white text-xs">
              <span className="text-amber-300">★ 4.9</span> · 10K+ Happy Customers
            </p>
          </div>
        </div>
      </div>

      {/* ===== Mobile: buttons image ke neeche (taaki image na dhake) ===== */}
      <div className="sm:hidden px-4 pt-5 pb-10">
        <div {...anim(150)} className={`flex flex-col gap-3 min-[420px]:flex-row ${anim(150).className}`}>
          <a
            href="#plan"
            className="group inline-flex flex-1 justify-center items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30 px-5 py-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 font-semibold text-white text-sm active:scale-95 transition"
          >
            Plan My Event
            {arrow}
          </a>
          <a
            href="#vendors"
            className="inline-flex flex-1 justify-center items-center gap-2 bg-white shadow-md px-5 py-3 rounded-full focus:outline-none ring-1 ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-500 font-semibold text-sky-800 text-sm active:scale-95 transition"
          >
            <span aria-hidden="true">📸</span>
            Explore Vendors
          </a>
        </div>
        <p {...anim(300)} className={`mt-3 text-center text-xs font-medium text-slate-600 ${anim(300).className}`}>
          <span className="text-amber-500">★ 4.9</span> · Trusted by 10K+ Happy Customers
        </p>
      </div>
    </section>
  );
}