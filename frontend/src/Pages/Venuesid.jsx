import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import Navbar from "../Components/Navbar";

// amenities kabhi array, kabhi JSON text, kabhi line/comma wala text aa sakte hain
const toList = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed : [String(v)];
  } catch {
    return String(v)
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
};

const fmt = (n) => Number(n || 0).toLocaleString("en-IN");
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
  pin: "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  phone:
    "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  users:
    "M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 6.5M18 14a6.5 6.5 0 013.5 6",
  map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14",
};

/* ---------- styles: sirf ek page-load moment + chhote hovers ---------- */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');

.vn-root { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
.vn-display { font-family: 'Bricolage Grotesque', 'DM Sans', ui-sans-serif, sans-serif; letter-spacing: -0.02em; }

@keyframes vn-cover { from { transform: scale(1.08); } to { transform: scale(1); } }
@keyframes vn-rise  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

.vn-cover { animation: vn-cover 1.4s cubic-bezier(.2,.7,.2,1) both; }
.vn-hero-1 { animation: vn-rise .7s .15s cubic-bezier(.2,.7,.2,1) both; }
.vn-hero-2 { animation: vn-rise .7s .28s cubic-bezier(.2,.7,.2,1) both; }
.vn-hero-3 { animation: vn-rise .7s .4s  cubic-bezier(.2,.7,.2,1) both; }

@media (prefers-reduced-motion: reduce) {
  .vn-cover, .vn-hero-1, .vn-hero-2, .vn-hero-3 { animation: none; }
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

export default function Venuesid() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setVenue(null);
    window.scrollTo(0, 0);

    api
      .get(`/venues/${id}`) // <-- /venues, /events ya /vendors nahi
      .then((res) => {
        let data = res.data;
        if (data && data.data) data = data.data;
        if (Array.isArray(data)) data = data[0];
        if (!data) throw new Error("not found");
        setVenue(data);
      })
      .catch((e) => {
        console.error("Venue fetch error:", e.response?.status, e.response?.data || e);
        setError(e.response?.status === 404 ? "Venue nahi mila" : "Venue load nahi ho paya");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <>
        <style>{styles}</style>
        <Navbar />
        <div className="vn-root">
          <Skeleton />
        </div>
      </>
    );

  if (error || !venue)
    return (
      <>
        <style>{styles}</style>
        <Navbar />
        <div className="py-28 text-center vn-root">
          <p className="mb-4 font-medium text-red-500">{error || "Venue nahi mila"}</p>
          <Link
            to="/Venues"
            className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-700 px-5 py-2.5 rounded-full text-white text-sm transition-colors"
          >
            <Icon d={ICONS.back} /> Saare venues dekho
          </Link>
        </div>
      </>
    );

  const amenities = toList(venue.amenities);
  const fullAddress = [venue.address, venue.city, venue.state, venue.pincode]
    .filter(Boolean)
    .join(", ");

  // Google Maps link: pehle latitude/longitude, na ho to address se
  const hasCoords = venue.latitude && venue.longitude;
  const mapsUrl = hasCoords
    ? `https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${venue.name} ${fullAddress}`
      )}`;

  const stats = [
    { label: "Guest capacity", value: fmt(venue.capacity) },
    { label: "City", value: venue.city || "—" },
    { label: "Pincode", value: venue.pincode || "—" },
  ];

  return (
    <>
      <style>{styles}</style>
      <Navbar />

      <div className="bg-stone-50 pb-24 lg:pb-16 min-h-screen text-slate-800 vn-root">
        {/* ================= HERO ================= */}
        <header className="relative bg-slate-900 h-80 sm:h-[26rem] overflow-hidden">
          {venue.cover_image ? (
            <img
              className="absolute inset-0 w-full h-full object-cover vn-cover"
              src={venue.cover_image}
              alt={venue.name}
              onError={hideBrokenImage}
            />
          ) : (
            <div className="absolute inset-0 flex justify-center items-center bg-gradient-to-br from-slate-800 to-indigo-900">
              <span className="font-extrabold text-[10rem] text-white/10 leading-none vn-display">
                {venue.name?.[0]}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/20" />

          <div className="relative mx-auto px-4 max-w-6xl h-full">
            <Link
              to="/Venues"
              className="inline-flex top-5 left-4 absolute items-center gap-1 bg-white/15 hover:bg-white/30 backdrop-blur px-3.5 py-1.5 rounded-full text-white text-sm transition-colors"
            >
              <Icon d={ICONS.back} /> Venues
            </Link>

            <div className="right-4 bottom-8 left-4 absolute">
              <div className="flex flex-wrap items-center gap-2 vn-hero-1">
                {venue.city && (
                  <span className="bg-amber-400 px-3 py-1 rounded-full font-semibold text-slate-900 text-xs">
                    {venue.city}
                  </span>
                )}
                {venue.capacity && (
                  <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-white text-xs">
                    <Icon d={ICONS.users} className="w-3.5 h-3.5" /> Up to {fmt(venue.capacity)} guests
                  </span>
                )}
              </div>

              <h1 className="mt-3 max-w-3xl font-extrabold text-white text-4xl sm:text-6xl leading-[1.05] vn-display vn-hero-2">
                {venue.name}
              </h1>

              <p className="flex items-center gap-1.5 mt-3 max-w-2xl text-white/80 text-sm vn-hero-3">
                <Icon d={ICONS.pin} className="flex-shrink-0 w-4 h-4" />
                {fullAddress}
              </p>
            </div>
          </div>
        </header>

        {/* ================= BODY ================= */}
        <div className="items-start gap-8 grid lg:grid-cols-[1fr_22rem] mx-auto px-4 max-w-6xl">
          {/* ---------- left column ---------- */}
          <main className="min-w-0">
            {/* stats strip */}
            <div className="relative grid grid-cols-3 bg-white shadow-lg shadow-slate-900/5 -mt-8 rounded-2xl divide-x divide-slate-100 ring-1 ring-slate-100">
              {stats.map((s) => (
                <div key={s.label} className="px-4 py-5 text-center">
                  <p className="font-bold text-slate-900 text-xl sm:text-3xl truncate vn-display">{s.value}</p>
                  <p className="mt-1 text-slate-500 text-xs sm:text-sm">{s.label}</p>
                </div>
              ))}
            </div>

            {/* about */}
            {venue.description && (
              <section className="mt-10">
                <h2 className="font-bold text-slate-900 text-2xl vn-display">About this venue</h2>
                <p className="mt-3 max-w-2xl text-slate-600 leading-relaxed">{venue.description}</p>
              </section>
            )}

            {/* amenities */}
            {amenities.length > 0 && (
              <section className="mt-10">
                <h2 className="font-bold text-slate-900 text-2xl vn-display">Amenities</h2>
                <ul className="gap-3 grid sm:grid-cols-2 mt-4">
                  {amenities.map((a, i) => (
                    <li
                      key={i}
                      className="group flex items-center gap-3 bg-white hover:bg-indigo-50 px-4 py-3 rounded-xl ring-1 ring-slate-200 hover:ring-indigo-200 transition-colors"
                    >
                      <span className="flex flex-shrink-0 justify-center items-center bg-indigo-100 group-hover:bg-indigo-600 rounded-full w-7 h-7 text-indigo-600 group-hover:text-white transition-colors">
                        <Icon d={ICONS.check} className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-slate-700 text-sm">{a}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </main>

          {/* ---------- right column: sticky contact card ---------- */}
          <aside className="lg:top-24 lg:sticky mt-2 lg:mt-[-2rem] pb-4">
            <div className="bg-white shadow-lg shadow-slate-900/5 p-6 rounded-2xl ring-1 ring-slate-100">
              <p className="text-slate-500 text-sm">Hosts up to</p>
              <p className="mt-1 font-extrabold text-slate-900 text-4xl vn-display">
                {fmt(venue.capacity)}
                <span className="ml-1 font-medium text-slate-400 text-base">guests</span>
              </p>

              <div className="space-y-3 mt-6">
                {venue.contact_phone && (
                  <a
                    href={`tel:${venue.contact_phone}`}
                    className="flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-600/25 hover:shadow-lg py-3 rounded-xl w-full font-semibold text-white text-sm transition-all"
                  >
                    <Icon d={ICONS.phone} /> Call now
                  </a>
                )}
                {venue.contact_email && (
                  <a
                    href={`mailto:${venue.contact_email}`}
                    className="flex justify-center items-center gap-2 hover:bg-slate-900 py-3 rounded-xl ring-1 ring-slate-300 hover:ring-slate-900 w-full font-semibold text-slate-800 hover:text-white text-sm transition-colors"
                  >
                    <Icon d={ICONS.mail} /> Send an email
                  </a>
                )}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex justify-center items-center gap-2 hover:bg-slate-900 py-3 rounded-xl ring-1 ring-slate-300 hover:ring-slate-900 w-full font-semibold text-slate-800 hover:text-white text-sm transition-colors"
                >
                  <Icon d={ICONS.map} /> Map pe dekho
                </a>
              </div>

              <ul className="space-y-3 mt-6 pt-6 border-slate-100 border-t text-slate-600 text-sm">
                {venue.contact_phone && (
                  <li className="flex items-center gap-3">
                    <Icon d={ICONS.phone} className="w-4 h-4 text-slate-400" />
                    {venue.contact_phone}
                  </li>
                )}
                {venue.contact_email && (
                  <li className="flex items-center gap-3 break-all">
                    <Icon d={ICONS.mail} className="flex-shrink-0 w-4 h-4 text-slate-400" />
                    {venue.contact_email}
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <Icon d={ICONS.pin} className="flex-shrink-0 mt-0.5 w-4 h-4 text-slate-400" />
                  {fullAddress}
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* ---------- mobile: bottom action bar ---------- */}
        <div className="lg:hidden right-0 bottom-0 left-0 z-30 fixed bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur px-4 py-3 border-slate-200 border-t">
          <div className="flex justify-between items-center gap-3 mx-auto max-w-6xl">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl ring-1 ring-slate-300 font-semibold text-slate-800 text-sm"
            >
              <Icon d={ICONS.map} /> Map
            </a>
            {venue.contact_phone && (
              <a
                href={`tel:${venue.contact_phone}`}
                className="flex flex-1 justify-center items-center gap-2 bg-indigo-600 active:bg-indigo-800 px-6 py-3 rounded-xl font-semibold text-white text-sm"
              >
                <Icon d={ICONS.phone} /> Call now
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}