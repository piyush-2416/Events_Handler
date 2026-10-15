import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
 

 const SLIDES = [
  {
    src: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?cs=srgb&dl=pexels-fu-zhichao-176355-587741.jpg&fm=jpg",
    alt: "Wedding reception decor",
  },
  {
    src: "https://img.freepik.com/premium-photo/festival-event-party-with-people-blurred-holiday-background_1028938-165464.jpg",
    alt: "Festival party crowd",
  },
  {
    src: "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?cs=srgb&dl=pexels-teddy-2263436.jpg&fm=jpg",
    alt: "Celebration event stage",
  },
  {
    src: "https://www.focuseventphotography.com/wp-content/uploads/2019/12/corporate-events-photographer-mirage-las-vegas.jpg",
    alt: "Corporate event hall",
  },
];

 
const INTERVAL = 5000

const hideBrokenImage = (e) => {
  e.target.style.display = "none";
};
const fmt = (n) => Number(n).toLocaleString("en-IN");
const asArray = (v) => (Array.isArray(v) ? v : []);

export default function Vendors() {
    const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
 
  // Auto-advance (ruk jata hai jab mouse hero par ho)
  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      INTERVAL
    );
    return () => clearInterval(id);
  }, [paused, active]);
  // ---------- Data ----------
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------- Filters ----------
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [city, setCity] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api
      .get("/vendors")
      .then((res) => setVendors(res.data))
      .catch(() => setError("Vendors load nahi ho paye"))
      .finally(() => setLoading(false));
  }, []);

  // Categories aur cities data se hi nikal lete hain (count ke saath)
  const categories = useMemo(() => {
    const map = {};
    vendors.forEach((v) => (map[v.category] = (map[v.category] || 0) + 1));
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [vendors]);

  const cities = useMemo(
    () => [...new Set(vendors.map((v) => v.city))].sort(),
    [vendors]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = vendors.filter((v) => {
      if (q && !`${v.name} ${v.category}`.toLowerCase().includes(q)) return false;
      if (activeCategory !== "all" && v.category !== activeCategory) return false;
      if (city !== "all" && v.city !== city) return false;
      if (Number(v.rating) < minRating) return false;
      if (verifiedOnly && !v.is_verified) return false;
      return true;
    });

    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "reviews") list.sort((a, b) => b.total_reviews - a.total_reviews);
    if (sort === "experience") list.sort((a, b) => b.experience_years - a.experience_years);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [vendors, search, activeCategory, city, minRating, verifiedOnly, sort]);

  const activeFilters =
    (search ? 1 : 0) +
    (activeCategory !== "all" ? 1 : 0) +
    (city !== "all" ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (verifiedOnly ? 1 : 0);

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("all");
    setCity("all");
    setMinRating(0);
    setVerifiedOnly(false);
    setSort("rating");
  };

  return (
    <>
      <Navbar />

         <br/>
          <section
      className="relative bg-gray-900 w-full h-[70vh] min-h-[460px] max-h-[640px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ---------- Background slides (crossfade + slow zoom) ---------- */}
      {SLIDES.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out motion-reduce:transition-none ${
            i === active ? "opacity-100 scale-110" : "opacity-0 scale-100"
          }`}
          style={{
            transitionProperty: "opacity, transform",
            transitionDuration: i === active ? "1400ms, 7000ms" : "1400ms, 1400ms",
          }}
        />
      ))}
 
      {/* ---------- Overlay: text ke peeche readable rakhne ke liye ---------- */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-950/50 to-gray-950/10" />
      <div className="bottom-0 absolute inset-x-0 bg-gradient-to-t from-gray-950/60 to-transparent h-32" />
 
      {/* ---------- Content ---------- */}
      <div className="relative flex items-center mx-auto px-4 max-w-7xl h-full">
        <div className="max-w-xl text-white">
          <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight">
            Har occasion ko
            <br />
            yaadgaar banayein
          </h1>
 
          <p className="mt-5 max-w-md text-gray-200 text-base sm:text-lg">
            Shaadi, birthday, corporate event ya party. Planning, decor aur
            guests ka kaam hum sambhalte hain.
          </p>
 
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="#categories"
              className="bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/30 shadow-lg px-6 py-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 font-semibold text-white text-sm transition"
            >
              Events dekhein
            </a>
            <a
              href="#events"
              className="bg-white/10 hover:bg-white/20 backdrop-blur px-6 py-3 border border-white/40 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white font-semibold text-white text-sm transition"
            >
              Free quote lein
            </a>
          </div>
        </div>
      </div>
 
      {/* ---------- Thumbnails (click karke image badlo) ---------- */}
      <div className="hidden right-4 md:right-8 bottom-5 absolute sm:flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === active}
            className={`relative h-14 w-20 overflow-hidden rounded-lg border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              i === active
                ? "border-white"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <img src={s.src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
 
      {/* ---------- Mobile dots ---------- */}
      <div className="sm:hidden bottom-4 left-1/2 absolute flex gap-2 -translate-x-1/2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
      <div className="bg-gray-50 min-h-screen">
        
        {/* ================= CATEGORY CHIPS ================= */}
        <section className="mx-auto px-4 pt-12 max-w-7xl">
          <h2 className="mb-2 font-bold text-3xl text-center">Vendor Categories</h2>
          <p className="mb-6 text-gray-500 text-center">
            Jis cheez ki zarurat hai wo chuno
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeCategory === "all"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-indigo-400"
              }`}
            >
              All ({vendors.length})
            </button>
            {categories.map(([name, count]) => (
              <button
                key={name}
                onClick={() => setActiveCategory(name)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  activeCategory === name
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-400"
                }`}
              >
                {name} ({count})
              </button>
            ))}
          </div>
        </section>

        {/* ================= FILTERS + VENDORS ================= */}
        <section id="listing" className="mx-auto px-4 pt-10 pb-16 max-w-7xl scroll-mt-20">
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="lg:hidden flex items-center gap-2 bg-white shadow mb-4 px-4 py-2 rounded-lg font-medium text-sm"
          >
            ⚙️ Filters
            {activeFilters > 0 && (
              <span className="bg-indigo-600 px-2 rounded-full text-white text-xs">
                {activeFilters}
              </span>
            )}
          </button>

          <div className="flex lg:flex-row flex-col gap-6">
            {/* ---------- SIDEBAR ---------- */}
            <aside className={`${showFilters ? "block" : "hidden"} lg:block lg:w-64 shrink-0`}>
              <div className="lg:top-20 lg:sticky space-y-6 bg-white shadow-md p-5 rounded-2xl">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button onClick={resetFilters} className="text-indigo-600 text-sm hover:underline">
                    Reset
                  </button>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">Search</label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Vendor ka naam..."
                    className="px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg outline-none w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">Sort by</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="bg-white px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg outline-none w-full text-sm"
                  >
                    <option value="rating">Top rated</option>
                    <option value="reviews">Most reviewed</option>
                    <option value="experience">Most experienced</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-white px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg outline-none w-full text-sm"
                  >
                    <option value="all">All cities</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">Minimum rating</label>
                  <div className="space-y-2">
                    {[
                      [0, "Any"],
                      [4, "4.0 & up"],
                      [4.5, "4.5 & up"],
                    ].map(([val, label]) => (
                      <label key={val} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === val}
                          onChange={() => setMinRating(val)}
                          className="accent-indigo-600"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="accent-indigo-600"
                  />
                  ✔ Sirf Verified vendors
                </label>
              </div>
            </aside>

            {/* ---------- VENDOR CARDS ---------- */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl">
                  {activeCategory === "all" ? "All Vendors" : activeCategory}
                  <span className="ml-2 font-normal text-gray-500 text-base">
                    ({filtered.length})
                  </span>
                </h2>
                {activeCategory !== "all" && (
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    Show all vendors
                  </button>
                )}
              </div>

              {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
              {loading && <p className="py-10 text-center">Loading vendors...</p>}
              {!loading && !error && filtered.length === 0 && (
                <p className="py-10 text-gray-500 text-center">
                  Koi vendor nahi mila. Filters change karke dekho.
                </p>
              )}

              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((v) => {
                  const services = asArray(v.services);
                  return (
                    <div
                      key={v.id}
                      className="group flex flex-col bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
                    >
                      <div className="relative bg-gray-200 h-48 overflow-hidden">
                        <img
                          src={v.cover_image}
                          alt={v.name}
                          onError={hideBrokenImage}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <span className="top-3 left-3 absolute bg-indigo-600 px-3 py-1 rounded-full text-white text-xs">
                          {v.category}
                        </span>
                        {v.is_verified && (
                          <span className="top-3 right-3 absolute bg-green-500 px-3 py-1 rounded-full font-medium text-white text-xs">
                            ✔ Verified
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col flex-1 p-4">
                        <h3 className="font-semibold text-lg">{v.name}</h3>
                        <p className="mt-1 text-gray-500 text-xs">
                          📍 {v.city}, {v.state}
                        </p>
                        <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                          {v.description}
                        </p>

                        <div className="flex justify-between mt-3 text-gray-500 text-sm">
                          <span>
                            ⭐ {Number(v.rating).toFixed(1)}{" "}
                            <span className="text-gray-400">({fmt(v.total_reviews)})</span>
                          </span>
                          <span>🏆 {v.experience_years} yrs</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {services.slice(0, 3).map((s) => (
                            <span key={s} className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 text-xs">
                              {s}
                            </span>
                          ))}
                          {services.length > 3 && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 text-xs">
                              +{services.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-auto pt-4">
                          <div>
                            <p className="font-bold text-indigo-600">₹{fmt(v.starting_price)}</p>
                            <p className="text-gray-400 text-xs">{v.price_unit}</p>
                          </div>
                          <a
                            href={`tel:${v.contact_phone}`}
                            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white text-sm transition"
                          >
                            Call now
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
