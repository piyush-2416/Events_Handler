import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  ICONS,
  Icon,
  fmt,
  asArray,
  listingStyles,
  ListingHero,
  ListingCard,
  ViewButton,
  IconLink,
  FilterPanel,
  Field,
  Segmented,
  Toggle,
  inputCls,
  ChipPicker,
  ResultsHeader,
  ActiveChips,
  CardSkeleton,
  EmptyState,
} from "../Components/ListingKit";

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

export default function Vendors() {
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
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, count]) => ({ key, label: key, count }));
  }, [vendors]);

  const cities = useMemo(() => [...new Set(vendors.map((v) => v.city))].sort(), [vendors]);

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

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("all");
    setCity("all");
    setMinRating(0);
    setVerifiedOnly(false);
    setSort("rating");
  };

  const chips = [
    search && { label: `“${search}”`, onClear: () => setSearch("") },
    activeCategory !== "all" && { label: activeCategory, onClear: () => setActiveCategory("all") },
    city !== "all" && { label: city, onClear: () => setCity("all") },
    minRating > 0 && { label: `${minRating}+ rating`, onClear: () => setMinRating(0) },
    verifiedOnly && { label: "Verified", onClear: () => setVerifiedOnly(false) },
  ].filter(Boolean);

  return (
    <div className="bg-stone-50 min-h-screen text-slate-800 ls-root">
      <style>{listingStyles}</style>
      <Navbar />

      <ListingHero
        slides={SLIDES}
        title={
          <>
            Sahi vendors,
            <br />
            ek hi jagah
          </>
        }
        subtitle="Decor, photography, catering aur bahut kuch. Rating aur reviews dekh kar apna vendor chuno."
        search={search}
        onSearch={setSearch}
        placeholder="Vendor ya category dhundho..."
      />

      {/* ================= CATEGORY CHIPS ================= */}
      <section className="mx-auto px-4 pt-14 max-w-7xl">
        <h2 className="font-bold text-slate-900 text-3xl ls-display">Vendor categories</h2>
        <p className="mt-1 mb-6 text-slate-500">Jis cheez ki zarurat hai wo chuno.</p>
        <ChipPicker
          items={categories}
          value={activeCategory}
          onChange={setActiveCategory}
          total={vendors.length}
          limit={5}
          placeholder="Category dhundho..."
        />
      </section>

      {/* ================= FILTERS + VENDORS ================= */}
      <section id="listing" className="mx-auto px-4 pt-12 pb-20 max-w-7xl scroll-mt-20">
        <div className="flex lg:flex-row flex-col gap-8">
          <FilterPanel activeCount={chips.length} onReset={resetFilters}>
            <Field label="Search">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Vendor ka naam..."
                className={inputCls}
              />
            </Field>

            <Field label="Sort by">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputCls}>
                <option value="rating">Top rated</option>
                <option value="reviews">Most reviewed</option>
                <option value="experience">Most experienced</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </Field>

            <Field label="City">
              <select value={city} onChange={(e) => setCity(e.target.value)} className={inputCls}>
                <option value="all">All cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Minimum rating">
              <Segmented
                value={minRating}
                onChange={setMinRating}
                options={[
                  [0, "Any"],
                  [4, "4.0+"],
                  [4.5, "4.5+"],
                ]}
              />
            </Field>

            <Toggle checked={verifiedOnly} onChange={setVerifiedOnly}>
              Sirf verified vendors
            </Toggle>
          </FilterPanel>

          {/* ---------- VENDOR CARDS ---------- */}
          <div className="flex-1 min-w-0">
            <ResultsHeader
              title={activeCategory === "all" ? "All vendors" : activeCategory}
              count={filtered.length}
              onShowAll={activeCategory !== "all" ? () => setActiveCategory("all") : undefined}
            />
            <ActiveChips chips={chips} />

            {error && (
              <p className="bg-red-50 mb-4 px-4 py-3 rounded-xl text-red-600 text-sm">{error}</p>
            )}

            {loading && (
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <EmptyState text="Koi vendor nahi mila. Filters change karke dekho." onReset={resetFilters} />
            )}

            {!loading && (
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((v, i) => (
                  <ListingCard
                    key={v.id}
                    index={i}
                    to={`/Vendorsid/${v.id}`}
                    image={v.cover_image}
                    alt={v.name}
                    badge={v.category}
                    topRight={
                      v.is_verified && (
                        <span className="inline-flex top-3 right-3 absolute items-center gap-1 bg-white/90 backdrop-blur px-3 py-1 rounded-full font-medium text-emerald-700 text-xs">
                          <Icon d={ICONS.shield} className="w-3.5 h-3.5" /> Verified
                        </span>
                      )
                    }
                    title={v.name}
                    location={`${v.city}, ${v.state}`}
                    description={v.description}
                    meta={[
                      {
                        icon: ICONS.star,
                        iconClass: "fill-amber-400 text-amber-400",
                        text: (
                          <>
                            {Number(v.rating).toFixed(1)}{" "}
                            <span className="text-slate-400">({fmt(v.total_reviews)})</span>
                          </>
                        ),
                      },
                      { icon: ICONS.award, text: `${v.experience_years} yrs` },
                    ]}
                    tags={asArray(v.services)}
                    tagLimit={3}
                    footer={
                      <div className="flex justify-between items-center gap-3">
                        <div>
                          <p className="font-extrabold text-slate-900 text-xl ls-display">
                            ₹{fmt(v.starting_price)}
                          </p>
                          {v.price_unit && <p className="text-slate-400 text-xs">{v.price_unit}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          {v.contact_phone && (
                            <IconLink href={`tel:${v.contact_phone}`} label="Call vendor" icon={ICONS.phone} />
                          )}
                          <ViewButton to={`/Vendorsid/${v.id}`} />
                        </div>
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
