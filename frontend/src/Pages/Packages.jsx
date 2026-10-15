import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
// import Hero from "..
// /Components/Hero";



const PRICE_MAX = 2500000; // slider ka max. Apne data ke hisaab se badal sakte ho
const TIERS = ["Basic", "Standard", "Premium", "Luxury"];

const SLIDES = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600", alt: "Wedding package" },
  { src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600", alt: "Birthday package" },
  { src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600", alt: "Corporate package" },
  { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600", alt: "Celebration setup" },
];

const TIER_STYLE = {
  Basic: "bg-gray-700 text-white",
  Standard: "bg-indigo-600 text-white",
  Premium: "bg-purple-600 text-white",
  Luxury: "bg-amber-400 text-gray-900",
};

const hideBrokenImage = (e) => {
  e.target.style.display = "none";
};
const fmt = (n) => Number(n).toLocaleString("en-IN");
const asArray = (v) => (Array.isArray(v) ? v : []);

export default function Packages() {
  // ---------- Data ----------
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------- Filters ----------
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [tier, setTier] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [guests, setGuests] = useState("");
  const [popularOnly, setPopularOnly] = useState(false);
  const [sort, setSort] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api
      .get("/packages")
      .then((res) => setPackages(res.data))
      .catch(() => setError("Packages load nahi ho paye"))
      .finally(() => setLoading(false));
  }, []);

  // Event types data se hi nikal lete hain (count ke saath)
  const eventTypes = useMemo(() => {
    const map = {};
    packages.forEach((p) => (map[p.event_type] = (map[p.event_type] || 0) + 1));
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [packages]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = packages.filter((p) => {
      const price = Number(p.price);
      if (q && !`${p.name} ${p.event_type}`.toLowerCase().includes(q)) return false;
      if (activeType !== "all" && p.event_type !== activeType) return false;
      if (tier !== "all" && p.tier !== tier) return false;
      if (price < minPrice || price > maxPrice) return false;
      if (guests && !(guests >= p.min_guests && guests <= p.max_guests)) return false;
      if (popularOnly && !p.is_popular) return false;
      return true;
    });

    if (sort === "popular")
      list.sort((a, b) => Number(b.is_popular) - Number(a.is_popular) || a.price - b.price);
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [packages, search, activeType, tier, minPrice, maxPrice, guests, popularOnly, sort]);

  const activeFilters =
    (search ? 1 : 0) +
    (activeType !== "all" ? 1 : 0) +
    (tier !== "all" ? 1 : 0) +
    (minPrice > 0 || maxPrice < PRICE_MAX ? 1 : 0) +
    (guests ? 1 : 0) +
    (popularOnly ? 1 : 0);

  const resetFilters = () => {
    setSearch("");
    setActiveType("all");
    setTier("all");
    setMinPrice(0);
    setMaxPrice(PRICE_MAX);
    setGuests("");
    setPopularOnly(false);
    setSort("popular");
  };

  const chip = (active) =>
    `px-4 py-2 rounded-full text-sm font-medium border transition ${
      active
        ? "bg-indigo-600 text-white border-indigo-600"
        : "bg-white text-gray-700 border-gray-200 hover:border-indigo-400"
    }`;

  return (
    <>
      <Navbar />

     

      <div className="bg-gray-50 min-h-screen">
        {/* ================= EVENT TYPE CHIPS ================= */}
        <section className="mx-auto px-4 pt-12 max-w-7xl">
          <h2 className="mb-2 font-bold text-3xl text-center">Package Types</h2>
          <p className="mb-6 text-gray-500 text-center">Apna event type chuno</p>

          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={() => setActiveType("all")} className={chip(activeType === "all")}>
              All ({packages.length})
            </button>
            {eventTypes.map(([name, count]) => (
              <button
                key={name}
                onClick={() => setActiveType(name)}
                className={chip(activeType === name)}
              >
                {name} ({count})
              </button>
            ))}
          </div>
        </section>

        {/* ================= FILTERS + PACKAGES ================= */}
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
                    placeholder="Package ka naam..."
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
                    <option value="popular">Popular first</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">Tier</label>
                  <div className="space-y-2">
                    {["all", ...TIERS].map((t) => (
                      <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="tier"
                          checked={tier === t}
                          onChange={() => setTier(t)}
                          className="accent-indigo-600"
                        />
                        {t === "all" ? "All" : t}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">Price Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="px-2 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg outline-none w-full text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="px-2 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg outline-none w-full text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={PRICE_MAX}
                    step="25000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="mt-3 w-full accent-indigo-600"
                  />
                  <p className="text-gray-500 text-xs">
                    ₹{fmt(minPrice)} - ₹{fmt(maxPrice)}
                  </p>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">Kitne guests?</label>
                  <input
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value ? Number(e.target.value) : "")}
                    placeholder="Jaise 150"
                    className="px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg outline-none w-full text-sm"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={popularOnly}
                    onChange={(e) => setPopularOnly(e.target.checked)}
                    className="accent-indigo-600"
                  />
                  🔥 Sirf Popular packages
                </label>
              </div>
            </aside>

            {/* ---------- PACKAGE CARDS ---------- */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl">
                  {activeType === "all" ? "All Packages" : `${activeType} Packages`}
                  <span className="ml-2 font-normal text-gray-500 text-base">
                    ({filtered.length})
                  </span>
                </h2>
                {activeType !== "all" && (
                  <button
                    onClick={() => setActiveType("all")}
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    Show all packages
                  </button>
                )}
              </div>

              {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
              {loading && <p className="py-10 text-center">Loading packages...</p>}
              {!loading && !error && filtered.length === 0 && (
                <p className="py-10 text-gray-500 text-center">
                  Koi package nahi mila. Filters change karke dekho.
                </p>
              )}

              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => {
                  const inclusions = asArray(p.inclusions);
                  return (
                    <div
                      key={p.id}
                      className="group flex flex-col bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
                    >
                      <div className="relative bg-gray-200 h-48 overflow-hidden">
                        <img
                          src={p.cover_image}
                          alt={p.name}
                          onError={hideBrokenImage}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <span
                          className={`top-3 left-3 absolute px-3 py-1 rounded-full text-xs font-medium ${
                            TIER_STYLE[p.tier] || "bg-gray-700 text-white"
                          }`}
                        >
                          {p.tier}
                        </span>
                        {p.is_popular && (
                          <span className="top-3 right-3 absolute bg-yellow-400 px-3 py-1 rounded-full font-medium text-xs">
                            🔥 Popular
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col flex-1 p-4">
                        <p className="font-medium text-indigo-600 text-xs">{p.event_type}</p>
                        <h3 className="mt-0.5 font-semibold text-lg">{p.name}</h3>
                        <p className="mt-1 text-gray-600 text-sm line-clamp-2">
                          {p.description}
                        </p>

                        <div className="flex justify-between mt-3 text-gray-500 text-sm">
                          <span>
                            👥 {fmt(p.min_guests)}-{fmt(p.max_guests)} guests
                          </span>
                          <span>⏱ {p.duration_hours} hrs</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {inclusions.slice(0, 4).map((i) => (
                            <span key={i} className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 text-xs">
                              {i}
                            </span>
                          ))}
                          {inclusions.length > 4 && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 text-xs">
                              +{inclusions.length - 4}
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-auto pt-4">
                          <div>
                            <p className="font-bold text-indigo-600">₹{fmt(p.price)}</p>
                            {Number(p.price_per_guest) > 0 && (
                              <p className="text-gray-400 text-xs">
                                + ₹{fmt(p.price_per_guest)}/guest
                              </p>
                            )}
                          </div>
                          <a
                            href={`/contact?package=${p.slug}`}
                            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white text-sm transition"
                          >
                            Get quote
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
