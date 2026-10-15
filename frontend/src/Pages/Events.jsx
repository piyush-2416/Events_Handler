import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
const PRICE_MAX = 500000; // slider ka max price. Apne data ke hisaab se badal sakte ho
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
const hideBrokenImage = (e) => {
  e.target.style.display = "none";
};
const INTERVAL = 5000;

export default function Events() {
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
 

  // ---------- Data state ----------
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState("");

  // ---------- Filter state ----------
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [guests, setGuests] = useState("");
  const [duration, setDuration] = useState("any"); // any | short | medium | long
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState("default");
  const [showFilters, setShowFilters] = useState(false); // mobile par toggle

  // ---------- Categories fetch ----------
  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setError("Categories load nahi ho payi"))
      .finally(() => setLoadingCats(false));
  }, []);

  // ---------- Events fetch (category badalne par) ----------
  useEffect(() => {
    setLoadingEvents(true);
    const url =
      activeCategory === "all" ? "/events" : `/events?category=${activeCategory}`;

    api
      .get(url)
      .then((res) => setEvents(res.data))
      .catch(() => setError("Events load nahi ho paye"))
      .finally(() => setLoadingEvents(false));
  }, [activeCategory]);

  // ---------- Filters apply ----------
  const filteredEvents = useMemo(() => {
    const list = events.filter((ev) => {
      const price = Number(ev.base_price);
      const hrs = Number(ev.duration_hours);

      if (search && !ev.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (price < minPrice || price > maxPrice) return false;
      if (guests && !(guests >= ev.min_guests && guests <= ev.max_guests))
        return false;
      if (duration === "short" && hrs > 3) return false;
      if (duration === "medium" && (hrs <= 3 || hrs > 6)) return false;
      if (duration === "long" && hrs <= 6) return false;
      if (featuredOnly && !ev.is_featured) return false;
      return true;
    });

    if (sort === "low") list.sort((a, b) => a.base_price - b.base_price);
    if (sort === "high") list.sort((a, b) => b.base_price - a.base_price);
    if (sort === "name") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [events, search, minPrice, maxPrice, guests, duration, featuredOnly, sort]);

  // Kitne filters lage hain (badge ke liye)
  const activeFilters =
    (search ? 1 : 0) +
    (minPrice > 0 || maxPrice < PRICE_MAX ? 1 : 0) +
    (guests ? 1 : 0) +
    (duration !== "any" ? 1 : 0) +
    (featuredOnly ? 1 : 0) +
    (activeCategory !== "all" ? 1 : 0);

  const resetFilters = () => {
    setSearch("");
    setMinPrice(0);
    setMaxPrice(PRICE_MAX);
    setGuests("");
    setDuration("any");
    setFeaturedOnly(false);
    setSort("default");
    setActiveCategory("all");
  };

  const fmt = (n) => Number(n).toLocaleString("en-IN");

  return (
  <>   <Navbar/>
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
    <div1 className="bg-gray-50 min-h-screen">
    {/* ================= CATEGORIES SECTION ================= */}
      <section className="mx-auto px-4 py-12 max-w-7xl">
        <h2 className="mb-2 font-bold text-3xl text-center">Event Categories</h2>
        <p className="mb-8 text-gray-500 text-center">
          Apni occasion chuno, baaki hum sambhal lenge
        </p>

        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
        {loadingCats && <p className="text-center">Loading...</p>}

        <div className="gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`group text-left rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                activeCategory === cat.slug
                  ? "border-indigo-600"
                  : "border-transparent"
              }`}
            >
              <div className="bg-gray-200 h-32 overflow-hidden">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  onError={hideBrokenImage}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold">{cat.name}</h3>
                <p className="mt-1 text-gray-500 text-xs line-clamp-2">
                  {cat.description}
                </p>
                {/* <p className="mt-2 font-medium text-indigo-600 text-sm">
  From ₹{fmt(cat.starting_price)}
</p> */}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ================= FILTER SIDEBAR + EVENTS ================= */}
      <section className="mx-auto px-4 pb-16 max-w-7xl">
        {/* Mobile par Filters button */}
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
          {/* ---------- FILTER SIDEBAR ---------- */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block lg:w-64 shrink-0`}
          >
            <div className="lg:top-20 lg:sticky space-y-6 bg-white shadow-md p-5 rounded-2xl">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-indigo-600 text-sm hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="block mb-2 font-semibold text-sm">Search</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Event ka naam..."
                  className="px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg outline-none w-full text-sm"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="block mb-2 font-semibold text-sm">Sort by</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-white px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg outline-none w-full text-sm"
                >
                  <option value="default">Default</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 font-semibold text-sm">Category</label>
                <div className="space-y-2 pr-1 max-h-48 overflow-y-auto">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={activeCategory === "all"}
                      onChange={() => setActiveCategory("all")}
                      className="accent-indigo-600"
                    />
                    All
                  </label>
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={activeCategory === cat.slug}
                        onChange={() => setActiveCategory(cat.slug)}
                        className="accent-indigo-600"
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <label className="block mb-2 font-semibold text-sm">
                  Price Range
                </label>
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
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="mt-3 w-full accent-indigo-600"
                />
                <p className="text-gray-500 text-xs">
                  ₹{fmt(minPrice)} - ₹{fmt(maxPrice)}
                </p>
              </div>

              {/* Guests */}
              <div>
                <label className="block mb-2 font-semibold text-sm">
                  Kitne guests?
                </label>
                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) =>
                    setGuests(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="Jaise 100"
                  className="px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg outline-none w-full text-sm"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block mb-2 font-semibold text-sm">Duration</label>
                <div className="space-y-2">
                  {[
                    ["any", "Any"],
                    ["short", "Up to 3 hrs"],
                    ["medium", "3 - 6 hrs"],
                    ["long", "6+ hrs"],
                  ].map(([val, label]) => (
                    <label
                      key={val}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="duration"
                        checked={duration === val}
                        onChange={() => setDuration(val)}
                        className="accent-indigo-600"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured */}
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => setFeaturedOnly(e.target.checked)}
                  className="accent-indigo-600"
                />
                ⭐ Sirf Featured events
              </label>
            </div>
          </aside>

          {/* ---------- EVENTS ---------- */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-2xl">
                {activeCategory === "all"
                  ? "All Events"
                  : categories.find((c) => c.slug === activeCategory)?.name}
                <span className="ml-2 font-normal text-gray-500 text-base">
                  ({filteredEvents.length})
                </span>  
              </h2>

              {activeCategory !== "all" && (
                <button
                  onClick={() => setActiveCategory("all")}
                  className="text-indigo-600 text-sm hover:underline"
                >
                  Show all events
                </button>
              )}
            </div>

            {loadingEvents && (
              <p className="py-10 text-center">Loading events...</p>
            )}

            {!loadingEvents && filteredEvents.length === 0 && (
              <p className="py-10 text-gray-500 text-center">
                Koi event nahi mila. Filters change karke dekho.
              </p>
            )}

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="group bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <div className="relative bg-gray-200 h-52 overflow-hidden">
                    <img
                      src={ev.image_url}
                      alt={ev.title}
                      onError={hideBrokenImage}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="top-3 left-3 absolute bg-indigo-600 px-3 py-1 rounded-full text-white text-xs">
                      {ev.category_name}
                    </span>
                    {ev.is_featured && (
                      <span className="top-3 right-3 absolute bg-yellow-400 px-3 py-1 rounded-full font-medium text-xs">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{ev.title}</h3>
                    <p className="mt-1 text-gray-600 text-sm">
                      {ev.short_description}
                    </p>

                    <div className="flex justify-between mt-3 text-gray-500 text-sm">
                      <span>
                        👥 {ev.min_guests}-{ev.max_guests} guests
                      </span>
                      <span>⏱ {ev.duration_hours} hrs</span>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <p className="font-bold text-indigo-600">
                          ₹{fmt(ev.base_price)}
                        </p>
                        {ev.price_per_guest && (
                          <p className="text-gray-400 text-xs">
                            + ₹{fmt(ev.price_per_guest)}/guest
                          </p>
                        )}
                      </div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white text-sm transition">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div1></>
  );
}
