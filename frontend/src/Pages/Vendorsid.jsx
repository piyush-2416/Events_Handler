import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import Navbar from "../Components/Navbar";

// services kabhi array, kabhi JSON text, kabhi line-by-line text aa sakte hain
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
  pin: "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  phone:
    "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM8.5 12.5l2.5 2.5 4.5-5",
};

/* ---------- styles: sirf ek page-load moment + chhote hovers ---------- */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');

.vd-root { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
.vd-display { font-family: 'Bricolage Grotesque', 'DM Sans', ui-sans-serif, sans-serif; letter-spacing: -0.02em; }

@keyframes vd-cover { from { transform: scale(1.08); } to { transform: scale(1); } }
@keyframes vd-rise  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

.vd-cover { animation: vd-cover 1.4s cubic-bezier(.2,.7,.2,1) both; }
.vd-hero-1 { animation: vd-rise .7s .15s cubic-bezier(.2,.7,.2,1) both; }
.vd-hero-2 { animation: vd-rise .7s .28s cubic-bezier(.2,.7,.2,1) both; }
.vd-hero-3 { animation: vd-rise .7s .4s  cubic-bezier(.2,.7,.2,1) both; }

@media (prefers-reduced-motion: reduce) {
  .vd-cover, .vd-hero-1, .vd-hero-2, .vd-hero-3 { animation: none; }
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

export default function Vendorsid() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setVendor(null);
    window.scrollTo(0, 0);

    api
      .get(`/vendors/${id}`) // <-- /vendors, /events nahi
      .then((res) => {
        let data = res.data;
        if (data && data.data) data = data.data;
        if (Array.isArray(data)) data = data[0];
        if (!data) throw new Error("not found");
        setVendor(data);
      })
      .catch((e) => {
        console.error("Vendor fetch error:", e.response?.status, e.response?.data || e);
        setError(e.response?.status === 404 ? "Vendor nahi mila" : "Vendor load nahi ho paya");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <>
        <style>{styles}</style>
        <Navbar />
        <div className="vd-root">
          <Skeleton />
        </div>
      </>
    );

  if (error || !vendor)
    return (
      <>
        <style>{styles}</style>
        <Navbar />
        <div className="py-28 text-center vd-root">
          <p className="mb-4 font-medium text-red-500">{error || "Vendor nahi mila"}</p>
          <Link
            to="/Vendors"
            className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-700 px-5 py-2.5 rounded-full text-white text-sm transition-colors"
          >
            <Icon d={ICONS.back} /> Saare vendors dekho
          </Link>
        </div>
      </>
    );

  const services = toList(vendor.services);
  const stats = [
    { label: "Rating", value: Number(vendor.rating || 0).toFixed(1), icon: ICONS.star },
    { label: "Reviews", value: Number(vendor.total_reviews || 0).toLocaleString("en-IN") },
    { label: "Years of experience", value: vendor.experience_years ?? "—" },
  ];

  return (
    <>
      <style>{styles}</style>
      <Navbar />

      <div className="bg-stone-50 pb-24 lg:pb-16 min-h-screen text-slate-800 vd-root">
        {/* ================= HERO ================= */}
        <header className="relative bg-slate-900 h-80 sm:h-[26rem] overflow-hidden">
          {vendor.cover_image ? (
            <img
              className="absolute inset-0 w-full h-full object-cover vd-cover"
              src={vendor.cover_image}
              alt={vendor.name}
              onError={hideBrokenImage}
            />
          ) : (
            <div className="absolute inset-0 flex justify-center items-center bg-gradient-to-br from-slate-800 to-indigo-900">
              <span className="font-extrabold text-[10rem] text-white/10 leading-none vd-display">
                {vendor.name?.[0]}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/20" />

          <div className="relative mx-auto px-4 max-w-6xl h-full">
            <Link
              to="/Vendors"
              className="inline-flex top-5 left-4 absolute items-center gap-1 bg-white/15 hover:bg-white/30 backdrop-blur px-3.5 py-1.5 rounded-full text-white text-sm transition-colors"
            >
              <Icon d={ICONS.back} /> Vendors
            </Link>

            <div className="right-4 bottom-8 left-4 absolute">
              <div className="flex flex-wrap items-center gap-2 vd-hero-1">
                {vendor.category && (
                  <span className="bg-amber-400 px-3 py-1 rounded-full font-semibold text-slate-900 text-xs">
                    {vendor.category}
                  </span>
                )}
                {vendor.is_verified && (
                  <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-white text-xs">
                    <Icon d={ICONS.shield} className="w-3.5 h-3.5" /> Verified vendor
                  </span>
                )}
              </div>

              <h1 className="mt-3 max-w-3xl font-extrabold text-white text-4xl sm:text-6xl leading-[1.05] vd-display vd-hero-2">
                {vendor.name}
              </h1>

              <p className="flex items-center gap-1.5 mt-3 text-white/80 text-sm vd-hero-3">
                <Icon d={ICONS.pin} />
                {vendor.city}, {vendor.state}
              </p>
            </div>
          </div>
        </header>

        {/* ================= BODY ================= */}
        <div className="items-start gap-8 grid lg:grid-cols-[1fr_22rem] mx-auto px-4 max-w-6xl">
          {/* ---------- left column ---------- */}
          <main className="min-w-0">
            {/* stats strip: ek hi panel, dividers ke saath */}
            <div className="relative grid grid-cols-3 bg-white shadow-lg shadow-slate-900/5 -mt-8 rounded-2xl divide-x divide-slate-100 ring-1 ring-slate-100">
              {stats.map((s) => (
                <div key={s.label} className="px-4 py-5 text-center">
                  <p className="flex justify-center items-center gap-1 font-bold text-slate-900 text-2xl sm:text-3xl vd-display">
                    {s.icon && <Icon d={s.icon} className="fill-amber-400 w-5 h-5 text-amber-400" />}
                    {s.value}
                  </p>
                  <p className="mt-1 text-slate-500 text-xs sm:text-sm">{s.label}</p>
                </div>
              ))}
            </div>

            {/* about */}
            {vendor.description && (
              <section className="mt-10">
                <h2 className="font-bold text-slate-900 text-2xl vd-display">About {vendor.name}</h2>
                <p className="mt-3 max-w-2xl text-slate-600 leading-relaxed">{vendor.description}</p>
              </section>
            )}

            {/* services */}
            {services.length > 0 && (
              <section className="mt-10">
                <h2 className="font-bold text-slate-900 text-2xl vd-display">What they offer</h2>
                <ul className="gap-3 grid sm:grid-cols-2 mt-4">
                  {services.map((s, i) => (
                    <li
                      key={i}
                      className="group flex items-center gap-3 bg-white hover:bg-indigo-50 px-4 py-3 rounded-xl ring-1 ring-slate-200 hover:ring-indigo-200 transition-colors"
                    >
                      <span className="flex flex-shrink-0 justify-center items-center bg-indigo-100 group-hover:bg-indigo-600 rounded-full w-7 h-7 text-indigo-600 group-hover:text-white transition-colors">
                        <Icon d={ICONS.check} className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-slate-700 text-sm">{s}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </main>

          {/* ---------- right column: sticky booking card ---------- */}
          <aside className="lg:top-24 lg:sticky mt-2 lg:mt-[-2rem] pb-4">
            <div className="bg-white shadow-lg shadow-slate-900/5 p-6 rounded-2xl ring-1 ring-slate-100">
              <p className="text-slate-500 text-sm">Starting at</p>
              <p className="mt-1 font-extrabold text-slate-900 text-4xl vd-display">
                {rupee(vendor.starting_price)}
                {vendor.price_unit && (
                  <span className="ml-1 font-medium text-slate-400 text-base">/ {vendor.price_unit}</span>
                )}
              </p>

              <div className="space-y-3 mt-6">
                {vendor.contact_phone && (
                  <a
                    href={`tel:${vendor.contact_phone}`}
                    className="flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-600/25 hover:shadow-lg py-3 rounded-xl w-full font-semibold text-white text-sm transition-all"
                  >
                    <Icon d={ICONS.phone} /> Call now
                  </a>
                )}
                {vendor.contact_email && (
                  <a
                    href={`mailto:${vendor.contact_email}`}
                    className="flex justify-center items-center gap-2 hover:bg-slate-900 py-3 rounded-xl ring-1 ring-slate-300 hover:ring-slate-900 w-full font-semibold text-slate-800 hover:text-white text-sm transition-colors"
                  >
                    <Icon d={ICONS.mail} /> Send an email
                  </a>
                )}
              </div>

              <ul className="space-y-3 mt-6 pt-6 border-slate-100 border-t text-slate-600 text-sm">
                {vendor.contact_person && (
                  <li className="flex items-center gap-3">
                    <Icon d={ICONS.user} className="w-4 h-4 text-slate-400" />
                    {vendor.contact_person}
                  </li>
                )}
                {vendor.contact_phone && (
                  <li className="flex items-center gap-3">
                    <Icon d={ICONS.phone} className="w-4 h-4 text-slate-400" />
                    {vendor.contact_phone}
                  </li>
                )}
                {vendor.contact_email && (
                  <li className="flex items-center gap-3 break-all">
                    <Icon d={ICONS.mail} className="flex-shrink-0 w-4 h-4 text-slate-400" />
                    {vendor.contact_email}
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </div>

        {/* ---------- mobile: bottom action bar ---------- */}
        {vendor.contact_phone && (
          <div className="lg:hidden right-0 bottom-0 left-0 z-30 fixed bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur px-4 py-3 border-slate-200 border-t">
            <div className="flex justify-between items-center gap-4 mx-auto max-w-6xl">
              <div>
                <p className="text-slate-500 text-xs">Starting at</p>
                <p className="font-bold text-slate-900 text-lg leading-tight vd-display">
                  {rupee(vendor.starting_price)}
                </p>
              </div>
              <a
                href={`tel:${vendor.contact_phone}`}
                className="flex items-center gap-2 bg-indigo-600 active:bg-indigo-800 px-6 py-3 rounded-xl font-semibold text-white text-sm"
              >
                <Icon d={ICONS.phone} /> Call now
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}