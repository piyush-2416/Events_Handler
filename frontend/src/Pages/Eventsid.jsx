import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const toList = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed : [String(v)];
  } catch {
    return String(v).split("\n").filter(Boolean);
  }
};

const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const hideBrokenImage = (e) => {
  e.target.style.display = "none";
};

/* ---------- tiny inline icons (no extra package needed) ---------- */
const Icon = ({ d, className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);
const ICONS = {
  back: "M15 18l-6-6 6-6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6L6 18",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  users:
    "M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 6.5M18 14a6.5 6.5 0 013.5 6",
  alert: "M12 4l9 16H3L12 4zM12 10v4M12 17.5v.01",
  wallet: "M4 7h14a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7zM4 7l11-3v3M16 13.5h.01",
};

/* ---------- styles: sirf ek page-load moment + chhote hovers ---------- */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');

.ev-root { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
.ev-display { font-family: 'Bricolage Grotesque', 'DM Sans', ui-sans-serif, sans-serif; letter-spacing: -0.02em; }

@keyframes ev-cover { from { transform: scale(1.08); } to { transform: scale(1); } }
@keyframes ev-rise  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

.ev-cover { animation: ev-cover 1.4s cubic-bezier(.2,.7,.2,1) both; }
.ev-hero-1 { animation: ev-rise .7s .15s cubic-bezier(.2,.7,.2,1) both; }
.ev-hero-2 { animation: ev-rise .7s .28s cubic-bezier(.2,.7,.2,1) both; }
.ev-hero-3 { animation: ev-rise .7s .4s  cubic-bezier(.2,.7,.2,1) both; }

/* estimate badalte hi number halka sa "tick" kare */
@keyframes ev-tick { from { opacity: .4; transform: translateY(4px); } to { opacity: 1; transform: none; } }
.ev-tick { animation: ev-tick .25s ease-out both; }

@media (prefers-reduced-motion: reduce) {
  .ev-cover, .ev-hero-1, .ev-hero-2, .ev-hero-3, .ev-tick { animation: none; }
}
`;

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="bg-slate-200 h-72 sm:h-96" />
    <div className="space-y-4 mx-auto px-4 py-10 max-w-6xl">
      <div className="bg-slate-200 rounded w-1/3 h-6" />
      <div className="bg-slate-200 rounded w-full h-4" />
      <div className="bg-slate-200 rounded w-2/3 h-4" />
    </div>
  </div>
);

export default function Eventsid() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [guests, setGuests] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError("");
    setEvent(null);

    api
      .get(`/events/${id}`)
      .then((res) => {
        let data = res.data;
        if (data && data.data) data = data.data;
        if (Array.isArray(data)) data = data[0];
        if (!data) throw new Error("Event nahi mila");

        setEvent(data);
        setGuests(Number(data.min_guests) || 1);
      })
      .catch((e) => {
        console.error("Event fetch error:", e.response?.status, e.response?.data || e);
        if (e.response?.status === 404) setError("Event nahi mila");
        else setError(e.message || "Event load nahi ho paya");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col bg-stone-50 min-h-screen">
        <style>{styles}</style>
        <Navbar />
        <div className="flex-grow ev-root">
          <Skeleton />
        </div>
        <Footer />
      </div>
    );

  if (error || !event)
    return (
      <div className="flex flex-col bg-stone-50 min-h-screen">
        <style>{styles}</style>
        <Navbar />
        <div className="flex flex-grow justify-center items-center px-4 py-20 ev-root">
          <div className="text-center">
            <p className="mb-2 font-semibold text-red-500">{error || "Event nahi mila"}</p>
            <p className="mx-auto mb-6 max-w-sm text-slate-500 text-sm">
              Ye event hata diya gaya ho sakta hai ya abhi available nahi hai.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-700 px-5 py-2.5 rounded-full text-white text-sm transition-colors"
            >
              <Icon d={ICONS.back} /> Saare events dekho
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );

  const inclusions = toList(event.inclusions);
  const exclusions = toList(event.exclusions);
  const estimate =
    Number(event.base_price || 0) +
    Number(event.price_per_guest || 0) * Number(guests || 0);

  const minG = event.min_guests || 0;
  const maxG = event.max_guests || 500;
  // slider ka filled hissa (indigo) dikhane ke liye
  const fill = maxG > minG ? ((guests - minG) / (maxG - minG)) * 100 : 0;

  const stats = [
    { label: "Base price", value: rupee(event.base_price) },
    { label: "Per guest", value: rupee(event.price_per_guest) },
    { label: "Guests allowed", value: `${event.min_guests} – ${event.max_guests}` },
    { label: "Duration", value: `${event.duration_hours} hrs` },
  ];

  return (
    <div className="flex flex-col bg-stone-50 min-h-screen text-slate-800 ev-root">
      <style>{styles}</style>
      <Navbar />

      <div className="flex-grow pb-16">
        {/* ================= HERO ================= */}
        <header className="relative bg-slate-900 h-80 sm:h-[26rem] overflow-hidden">
          {event.image_url ? (
            <img
              className="absolute inset-0 w-full h-full object-cover ev-cover"
              src={event.image_url}
              alt={event.title}
              onError={hideBrokenImage}
            />
          ) : (
            <div className="absolute inset-0 flex justify-center items-center bg-gradient-to-br from-slate-800 to-indigo-900">
              <span className="font-extrabold text-[10rem] text-white/10 leading-none ev-display">
                {event.title?.[0]}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/20" />

          <div className="relative mx-auto px-4 max-w-6xl h-full">
            <Link
              to="/events"
              className="inline-flex top-5 left-4 absolute items-center gap-1 bg-white/15 hover:bg-white/30 backdrop-blur px-3.5 py-1.5 rounded-full text-white text-sm transition-colors"
            >
              <Icon d={ICONS.back} /> Events
            </Link>

            <div className="right-4 bottom-8 left-4 absolute">
              <div className="flex flex-wrap items-center gap-2 ev-hero-1">
                {event.category_name && (
                  <span className="bg-amber-400 px-3 py-1 rounded-full font-semibold text-slate-900 text-xs">
                    {event.category_name}
                  </span>
                )}
                {event.duration_hours && (
                  <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-white text-xs">
                    <Icon d={ICONS.clock} className="w-3.5 h-3.5" /> {event.duration_hours} hours
                  </span>
                )}
              </div>

              <h1 className="mt-3 max-w-3xl font-extrabold text-white text-4xl sm:text-6xl leading-[1.05] ev-display ev-hero-2">
                {event.title}
              </h1>

              <p className="flex items-center gap-1.5 mt-3 text-white/80 text-sm ev-hero-3">
                <Icon d={ICONS.users} />
                {event.min_guests} to {event.max_guests} guests
              </p>
            </div>
          </div>
        </header>

        <div className="mx-auto px-4 max-w-6xl">
          {/* ---------- stats strip ---------- */}
          <div className="relative gap-px grid grid-cols-2 sm:grid-cols-4 bg-slate-100 shadow-lg shadow-slate-900/5 -mt-8 rounded-2xl ring-1 ring-slate-100 overflow-hidden">
            {stats.map((s) => (
              <div key={s.label} className="bg-white px-4 py-5 text-center">
                <p className="font-bold text-slate-900 text-xl sm:text-2xl truncate ev-display">{s.value}</p>
                <p className="mt-1 text-slate-500 text-xs sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="items-start gap-8 grid lg:grid-cols-[1fr_22rem] mt-10">
            {/* ---------- left column ---------- */}
            <main className="min-w-0">
              {/* about */}
              {(event.description || event.short_description) && (
                <section>
                  <h2 className="font-bold text-slate-900 text-2xl ev-display">About this event</h2>
                  <p className="mt-3 max-w-2xl text-slate-600 leading-relaxed">
                    {event.description || event.short_description}
                  </p>
                </section>
              )}

              {/* inclusions / exclusions */}
              {(inclusions.length > 0 || exclusions.length > 0) && (
                <section className="gap-4 grid sm:grid-cols-2 mt-10">
                  {inclusions.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl ring-1 ring-slate-200">
                      <h3 className="font-bold text-slate-900 text-xl ev-display">What’s included</h3>
                      <ul className="space-y-3 mt-4">
                        {inclusions.map((x, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                            <span className="flex flex-shrink-0 justify-center items-center bg-emerald-100 mt-0.5 rounded-full w-5 h-5 text-emerald-600">
                              <Icon d={ICONS.check} className="w-3 h-3" />
                            </span>
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exclusions.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl ring-1 ring-slate-200">
                      <h3 className="font-bold text-slate-900 text-xl ev-display">What’s not included</h3>
                      <ul className="space-y-3 mt-4">
                        {exclusions.map((x, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                            <span className="flex flex-shrink-0 justify-center items-center bg-rose-100 mt-0.5 rounded-full w-5 h-5 text-rose-500">
                              <Icon d={ICONS.x} className="w-3 h-3" />
                            </span>
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {/* terms */}
              {event.terms && (
                <section className="flex gap-3 bg-amber-50 mt-10 p-5 border-amber-400 border-l-4 rounded-r-2xl">
                  <Icon d={ICONS.alert} className="flex-shrink-0 mt-0.5 w-5 h-5 text-amber-600" />
                  <div>
                    <h3 className="font-semibold text-amber-900">Terms & conditions</h3>
                    <p className="mt-1 text-slate-600 text-sm leading-relaxed">{event.terms}</p>
                  </div>
                </section>
              )}
            </main>

            {/* ---------- right column: sticky estimator ---------- */}
            <aside className="lg:top-24 lg:sticky order-first lg:order-none">
              <div className="bg-white shadow-lg shadow-slate-900/5 p-6 rounded-2xl ring-1 ring-slate-100">
                <p className="text-slate-500 text-sm">Estimated cost</p>
                <p key={estimate} className="mt-1 font-extrabold text-slate-900 text-4xl ev-display ev-tick">
                  {rupee(estimate)}
                </p>
                <p className="mt-1 text-slate-400 text-xs">
                  {rupee(event.base_price)} base + {guests} × {rupee(event.price_per_guest)}
                </p>

                <div className="mt-6">
                  <div className="flex justify-between items-baseline mb-3 text-sm">
                    <span className="font-semibold text-slate-700">Guests</span>
                    <span className="font-bold text-indigo-600 text-xl ev-display">{guests}</span>
                  </div>
                  <input
                    type="range"
                    min={minG}
                    max={maxG}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    aria-label="Number of guests"
                    className="rounded-full w-full h-2 accent-indigo-600 appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #4f46e5 ${fill}%, #e2e8f0 ${fill}%)`,
                    }}
                  />
                  <div className="flex justify-between mt-2 text-slate-400 text-xs">
                    <span>{minG}</span>
                    <span>{maxG}</span>
                  </div>
                </div>

                <div className="space-y-3 mt-6 pt-6 border-slate-100 border-t">
                  <Link
                    to={`/guestlist/${event.id}`}
                    className="group flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-600/25 hover:shadow-lg py-3 rounded-xl w-full font-semibold text-white text-sm transition-all"
                  >
                    Guest List Banao
                    <Icon
                      d={ICONS.arrow}
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                  <Link
                    to="/Budgetplanner"
                    className="flex justify-center items-center gap-2 hover:bg-slate-900 py-3 rounded-xl ring-1 ring-slate-300 hover:ring-slate-900 w-full font-semibold text-slate-800 hover:text-white text-sm transition-colors"
                  >
                    <Icon d={ICONS.wallet} /> Budget Plan Karo
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}