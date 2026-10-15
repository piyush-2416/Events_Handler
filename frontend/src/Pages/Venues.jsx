import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
// import Hero from "../Components
// /Hero";

const SLIDES = [
  { src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600", alt: "Banquet hall" },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600", alt: "Wedding lawn" },
  { src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600", alt: "Resort venue" },
  { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600", alt: "Destination resort" },
];

const hideBrokenImage = (e) => {
  e.target.style.display = "none";
};
const fmt = (n) => Number(n).toLocaleString("en-IN");
const asArray = (v) => (Array.isArray(v) ? v : []);

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
  const [showFilters, setShowFilters] = useState(false);

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
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
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

  const activeFilters =
    (search ? 1 : 0) +
    (city !== "all" ? 1 : 0) +
    (guests ? 1 : 0) +
    selectedAmenities.length;

  const resetFilters = () => {
    setSearch("");
    setCity("all");
    setGuests("");
    setSelectedAmenities([]);
    setSort("default");
  };

  return (
    <>
      <Navbar />

       
       
      <div className="bg-gray-50 max-h-screen">
        {/* ================= CITY CHIPS ================= */}
        <section className="mx-auto px-4 pt-12 max-w-7xl">
            <br/>
          <h2 className="mb-2 font-bold text-3xl text-center">Cities</h2>
          <p className="mb-6 text-gray-500 text-center">Apni city ke venues dekho</p>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setCity("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                city === "all"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-indigo-400"
              }`}
            >
              All ({venues.length})
            </button>
            {cities.map(([name, count]) => (
              <button
                key={name}
                onClick={() => setCity(name)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  city === name
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-400"
                }`}
              >
                {name} ({count})
              </button>
            ))}
          </div>
        </section>

        {/* ================= FILTERS + VENUES ================= */}
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
                    placeholder="Venue ya area ka naam..."
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
                    <option value="default">Default</option>
                    <option value="big">Capacity: High to Low</option>
                    <option value="small">Capacity: Low to High</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">Kitne guests?</label>
                  <input
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value ? Number(e.target.value) : "")}
                    placeholder="Jaise 300"
                    className="px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg outline-none w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">Amenities</label>
                  <div className="space-y-2 pr-1 max-h-56 overflow-y-auto">
                    {allAmenities.map((a) => (
                      <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(a)}
                          onChange={() => toggleAmenity(a)}
                          className="accent-indigo-600"
                        />
                        {a}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* ---------- VENUE CARDS ---------- */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl">
                  {city === "all" ? "All Venues" : `Venues in ${city}`}
                  <span className="ml-2 font-normal text-gray-500 text-base">
                    ({filtered.length})
                  </span>
                </h2>
                {city !== "all" && (
                  <button
                    onClick={() => setCity("all")}
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    Show all venues
                  </button>
                )}
              </div>

              {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
              {loading && <p className="py-10 text-center">Loading venues...</p>}
              {!loading && !error && filtered.length === 0 && (
                <p className="py-10 text-gray-500 text-center">
                  Koi venue nahi mila. Filters change karke dekho.
                </p>
              )}

              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((v) => {
                  const amenities = asArray(v.amenities);
                  return (
                    <div
                      key={v.id}
                      className="group flex flex-col bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
                    >
                      <div className="relative bg-gray-200 h-52 overflow-hidden">
                        <img
                          src={v.cover_image}
                          alt={v.name}
                          onError={hideBrokenImage}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <span className="top-3 left-3 absolute bg-indigo-600 px-3 py-1 rounded-full text-white text-xs">
                          {v.city}
                        </span>
                      </div>

                      <div className="flex flex-col flex-1 p-4">
                        <h3 className="font-semibold text-lg">{v.name}</h3>
                        <p className="mt-1 text-gray-500 text-xs">
                          📍 {v.address}, {v.city}, {v.state} - {v.pincode}
                        </p>
                        <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                          {v.description}
                        </p>

                        <p className="mt-3 text-gray-500 text-sm">
                          👥 Up to {fmt(v.capacity)} guests
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {amenities.slice(0, 4).map((a) => (
                            <span key={a} className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 text-xs">
                              {a}
                            </span>
                          ))}
                          {amenities.length > 4 && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 text-xs">
                              +{amenities.length - 4}
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-auto pt-4">
                          <a
                            href={`mailto:${v.contact_email}`}
                            className="text-indigo-600 text-sm hover:underline"
                          >
                            Email karein
                          </a>
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
