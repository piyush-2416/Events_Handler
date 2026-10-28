import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  ICONS,
  Icon,
  fmt,
  hideBrokenImage,
  listingStyles,
  ListingHero,
  ListingCard,
  ViewButton,
  FilterPanel,
  Field,
  Segmented,
  Toggle,
  inputCls,
  ResultsHeader,
  ActiveChips,
  CardSkeleton,
  EmptyState,
} from "../Components/ListingKit";

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

export default function Events() {
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

  const categoryName = categories.find((c) => c.slug === activeCategory)?.name;

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

  // Lage hue filters (removable chips + mobile badge dono isi se)
  const chips = [
    search && { label: `“${search}”`, onClear: () => setSearch("") },
    activeCategory !== "all" && {
      label: categoryName || activeCategory,
      onClear: () => setActiveCategory("all"),
    },
    (minPrice > 0 || maxPrice < PRICE_MAX) && {
      label: `₹${fmt(minPrice)} – ₹${fmt(maxPrice)}`,
      onClear: () => {
        setMinPrice(0);
        setMaxPrice(PRICE_MAX);
      },
    },
    guests && { label: `${guests} guests`, onClear: () => setGuests("") },
    duration !== "any" && {
      label: { short: "Up to 3 hrs", medium: "3 – 6 hrs", long: "6+ hrs" }[duration],
      onClear: () => setDuration("any"),
    },
    featuredOnly && { label: "Featured", onClear: () => setFeaturedOnly(false) },
  ].filter(Boolean);

  const fill = (maxPrice / PRICE_MAX) * 100;

  return (
    <div className="bg-stone-50 min-h-screen text-slate-800 ls-root">
      <style>{listingStyles}</style>
      <Navbar />

      <ListingHero
        slides={SLIDES}
        title={
          <>
            Har occasion ko
            <br />
            yaadgaar banayein
          </>
        }
        subtitle="Shaadi, birthday, corporate event ya party. Planning, decor aur guests ka kaam hum sambhalte hain."
        search={search}
        onSearch={setSearch}
        placeholder="Event ka naam dhundho..."
      />

      {/* ================= CATEGORIES ================= */}
      <section id="categories" className="mx-auto px-4 pt-14 max-w-7xl">
        <h2 className="font-bold text-slate-900 text-3xl ls-display">Event categories</h2>
        <p className="mt-1 text-slate-500">Apni occasion chuno, baaki hum sambhal lenge.</p>

        <div className="flex flex-wrap gap-x-6 gap-y-6 mt-8">
          {loadingCats &&
            [...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                <div className="bg-slate-200 rounded-full w-16 sm:w-20 h-16 sm:h-20" />
                <div className="bg-slate-200 rounded w-14 h-3" />
              </div>
            ))}

          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                // dobara click karne par category hat jaati hai
                onClick={() => setActiveCategory(isActive ? "all" : cat.slug)}
                aria-pressed={isActive}
                className="group flex flex-col items-center gap-2.5 focus:outline-none w-20 sm:w-24"
              >
                <div
                  className={`h-16 w-16 overflow-hidden rounded-full bg-slate-200 ring-2 ring-offset-2 ring-offset-stone-50 transition-all duration-300 group-focus-visible:ring-indigo-400 sm:h-20 sm:w-20 ${
                    isActive ? "ring-indigo-600" : "ring-transparent group-hover:ring-indigo-300"
                  }`}
                >
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    onError={hideBrokenImage}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span
                  className={`text-center text-xs font-semibold leading-tight transition-colors sm:text-sm ${
                    isActive ? "text-indigo-600" : "text-slate-700 group-hover:text-indigo-600"
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= FILTERS + EVENTS ================= */}
      <section id="listing" className="mx-auto px-4 pt-14 pb-20 max-w-7xl scroll-mt-20">
        <div className="flex lg:flex-row flex-col gap-8">
          <FilterPanel activeCount={chips.length} onReset={resetFilters}>
            <Field label="Search">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Event ka naam..."
                className={inputCls}
              />
            </Field>

            <Field label="Sort by">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputCls}>
                <option value="default">Default</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </Field>

            <Field label="Category">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className={inputCls}
              >
                <option value="all">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Price range">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  placeholder="Min"
                  className={inputCls}
                />
                <span className="text-slate-300">–</span>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  placeholder="Max"
                  className={inputCls}
                />
              </div>
              <input
                type="range"
                min="0"
                max={PRICE_MAX}
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Maximum price"
                className="mt-4 rounded-full w-full h-2 accent-indigo-600 appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4f46e5 ${fill}%, #e2e8f0 ${fill}%)`,
                }}
              />
              <p className="mt-2 text-slate-400 text-xs">
                ₹{fmt(minPrice)} – ₹{fmt(maxPrice)}
              </p>
            </Field>

            <Field label="Kitne guests?">
              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value ? Number(e.target.value) : "")}
                placeholder="Jaise 100"
                className={inputCls}
              />
            </Field>

            <Field label="Duration">
              <Segmented
                value={duration}
                onChange={setDuration}
                options={[
                  ["any", "Any"],
                  ["short", "Up to 3 hrs"],
                  ["medium", "3 – 6 hrs"],
                  ["long", "6+ hrs"],
                ]}
              />
            </Field>

            <Toggle checked={featuredOnly} onChange={setFeaturedOnly}>
              Sirf featured events
            </Toggle>
          </FilterPanel>

          {/* ---------- EVENTS ---------- */}
          <div className="flex-1 min-w-0">
            <ResultsHeader
              title={activeCategory === "all" ? "All events" : categoryName}
              count={filteredEvents.length}
              onShowAll={activeCategory !== "all" ? () => setActiveCategory("all") : undefined}
            />
            <ActiveChips chips={chips} />

            {error && (
              <p className="bg-red-50 mb-4 px-4 py-3 rounded-xl text-red-600 text-sm">{error}</p>
            )}

            {loadingEvents && (
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            )}

            {!loadingEvents && filteredEvents.length === 0 && (
              <EmptyState text="Koi event nahi mila. Filters change karke dekho." onReset={resetFilters} />
            )}

            {!loadingEvents && (
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {filteredEvents.map((ev, i) => (
                  <ListingCard
                    key={ev.id}
                    index={i}
                    to={`/Eventsid/${ev.id}`}
                    image={ev.image_url}
                    alt={ev.title}
                    badge={ev.category_name}
                    topRight={
                      ev.is_featured && (
                        <span className="inline-flex top-3 right-3 absolute items-center gap-1 bg-white/90 backdrop-blur px-3 py-1 rounded-full font-medium text-slate-800 text-xs">
                          <Icon d={ICONS.star} className="fill-amber-400 w-3.5 h-3.5 text-amber-400" />
                          Featured
                        </span>
                      )
                    }
                    title={ev.title}
                    description={ev.short_description}
                    meta={[
                      { icon: ICONS.users, text: `${ev.min_guests}–${ev.max_guests} guests` },
                      { icon: ICONS.clock, text: `${ev.duration_hours} hrs` },
                    ]}
                    footer={
                      <div className="flex justify-between items-center gap-3">
                        <div>
                          <p className="font-extrabold text-slate-900 text-xl ls-display">
                            ₹{fmt(ev.base_price)}
                          </p>
                          {ev.price_per_guest && (
                            <p className="text-slate-400 text-xs">+ ₹{fmt(ev.price_per_guest)} / guest</p>
                          )}
                        </div>
                        <ViewButton to={`/Eventsid/${ev.id}`} />
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
}
