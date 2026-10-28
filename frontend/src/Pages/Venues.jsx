import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  ICONS,
  fmt,
  asArray,
  listingStyles,
  ListingHero,
  ListingCard,
  ViewButton,
  IconLink,
  FilterPanel,
  Field,
  inputCls,
  ChipPicker,
  ResultsHeader,
  ActiveChips,
  CardSkeleton,
  EmptyState,
} from "../Components/ListingKit";

const SLIDES = [
  { src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600", alt: "Banquet hall" },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600", alt: "Wedding lawn" },
  { src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600", alt: "Resort venue" },
  { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600", alt: "Destination resort" },
];

export default function Venues() {
  // ---------- Data ----------
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------- Filters ----------
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [guests, setGuests] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    api
      .get("/venues")
      .then((res) => setVenues(res.data))
      .catch(() => setError("Venues load nahi ho paye"))
      .finally(() => setLoading(false));
  }, []);

  // City chips aur amenities data se nikalte hain
  const cities = useMemo(() => {
    const map = {};
    venues.forEach((v) => (map[v.city] = (map[v.city] || 0) + 1));
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, count]) => ({ key, label: key, count }));
  }, [venues]);

  const allAmenities = useMemo(
    () => [...new Set(venues.flatMap((v) => asArray(v.amenities)))].sort(),
    [venues]
  );

  const toggleAmenity = (a) =>
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = venues.filter((v) => {
      if (q && !`${v.name} ${v.address}`.toLowerCase().includes(q)) return false;
      if (city !== "all" && v.city !== city) return false;
      if (guests && Number(v.capacity) < guests) return false;
      const have = asArray(v.amenities);
      if (!selectedAmenities.every((a) => have.includes(a))) return false;
      return true;
    });

    if (sort === "big") list.sort((a, b) => b.capacity - a.capacity);
    if (sort === "small") list.sort((a, b) => a.capacity - b.capacity);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [venues, search, city, guests, selectedAmenities, sort]);

  const resetFilters = () => {
    setSearch("");
    setCity("all");
    setGuests("");
    setSelectedAmenities([]);
    setSort("default");
  };

  const chips = [
    search && { label: `“${search}”`, onClear: () => setSearch("") },
    city !== "all" && { label: city, onClear: () => setCity("all") },
    guests && { label: `${guests}+ guests`, onClear: () => setGuests("") },
    ...selectedAmenities.map((a) => ({ label: a, onClear: () => toggleAmenity(a) })),
  ].filter(Boolean);

  return (
    <div className="bg-stone-50 min-h-screen text-slate-800 ls-root">
      <style>{listingStyles}</style>
      <Navbar />

      <ListingHero
        slides={SLIDES}
        title={
          <>
            Aapki occasion ka
            <br />
            perfect venue
          </>
        }
        subtitle="Banquet hall, lawn ya resort. Capacity aur amenities dekh kar apni city ka venue chuno."
        search={search}
        onSearch={setSearch}
        placeholder="Venue ya area ka naam dhundho..."
      />

      {/* ================= CITY CHIPS ================= */}
      <section className="mx-auto px-4 pt-14 max-w-7xl">
        <h2 className="font-bold text-slate-900 text-3xl ls-display">Cities</h2>
        <p className="mt-1 mb-6 text-slate-500">Apni city ke venues dekho.</p>
        <ChipPicker
          items={cities}
          value={city}
          onChange={setCity}
          total={venues.length}
          limit={5}
          placeholder="City dhundho..."
        />
      </section>

      {/* ================= FILTERS + VENUES ================= */}
      <section id="listing" className="mx-auto px-4 pt-12 pb-20 max-w-7xl scroll-mt-20">
        <div className="flex lg:flex-row flex-col gap-8">
          <FilterPanel activeCount={chips.length} onReset={resetFilters}>
            <Field label="Search">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Venue ya area ka naam..."
                className={inputCls}
              />
            </Field>

            <Field label="Sort by">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputCls}>
                <option value="default">Default</option>
                <option value="big">Capacity: High to Low</option>
                <option value="small">Capacity: Low to High</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </Field>

            <Field label="Kitne guests?">
              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value ? Number(e.target.value) : "")}
                placeholder="Jaise 300"
                className={inputCls}
              />
            </Field>

            <Field label="Amenities">
              <div className="space-y-1 pr-1 max-h-56 overflow-y-auto">
                {allAmenities.map((a) => (
                  <label
                    key={a}
                    className="flex items-center gap-2.5 hover:bg-stone-50 -mx-2 px-2 py-1.5 rounded-lg text-slate-700 text-sm transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(a)}
                      onChange={() => toggleAmenity(a)}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    {a}
                  </label>
                ))}
              </div>
            </Field>
          </FilterPanel>

          {/* ---------- VENUE CARDS ---------- */}
          <div className="flex-1 min-w-0">
            <ResultsHeader
              title={city === "all" ? "All venues" : `Venues in ${city}`}
              count={filtered.length}
              onShowAll={city !== "all" ? () => setCity("all") : undefined}
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
              <EmptyState text="Koi venue nahi mila. Filters change karke dekho." onReset={resetFilters} />
            )}

            {!loading && (
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((v, i) => (
                  <ListingCard
                    key={v.id}
                    index={i}
                    to={`/Venuesid/${v.id}`}
                    image={v.cover_image}
                    alt={v.name}
                    badge={v.city}
                    title={v.name}
                    location={`${v.address}, ${v.city}, ${v.state} - ${v.pincode}`}
                    description={v.description}
                    meta={[{ icon: ICONS.users, text: `Up to ${fmt(v.capacity)} guests` }]}
                    tags={asArray(v.amenities)}
                    tagLimit={4}
                    footer={
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex items-center gap-2">
                          {v.contact_phone && (
                            <IconLink href={`tel:${v.contact_phone}`} label="Call venue" icon={ICONS.phone} />
                          )}
                          {v.contact_email && (
                            <IconLink href={`mailto:${v.contact_email}`} label="Email venue" icon={ICONS.mail} />
                          )}
                        </div>
                        <ViewButton to={`/Venuesid/${v.id}`} />
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
