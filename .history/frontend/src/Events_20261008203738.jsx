import { useEffect, useState } from "react";
import api from "./api";

// Image toot jaye to gray box dikhe, page kharab na lage
const hideBrokenImage = (e) => {
  e.target.style.display = "none";
};

export default function Events() {
  // ---------- State ----------
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all"); // "all" ya category slug
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState("");

  // ---------- Categories ek baar fetch karo ----------
  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setError("Categories load nahi ho payi"))
      .finally(() => setLoadingCats(false));
  }, []);

  // ---------- Events: jab bhi category badle, dobara fetch ----------
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

  return (
    <div className="bg-gray-50 min-h-screen">
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
                <p className="mt-2 font-medium text-indigo-600 text-sm">
                  From ₹{Number(cat.starting_price).toLocaleString("en-IN")}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ================= EVENTS SECTION ================= */}
      <section className="mx-auto px-4 pb-16 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-2xl">
            {activeCategory === "all"
              ? "All Events"
              : categories.find((c) => c.slug === activeCategory)?.name}
          </h2>

          {/* Filter clear karne ka button */}
          {activeCategory !== "all" && (
            <button
              onClick={() => setActiveCategory("all")}
              className="text-indigo-600 text-sm hover:underline"
            >
              Show all events
            </button>
          )}
        </div>

        {loadingEvents && <p className="py-10 text-center">Loading events...</p>}

        {!loadingEvents && events.length === 0 && (
          <p className="py-10 text-gray-500 text-center">
            Is category me abhi koi event nahi hai
          </p>
        )}

        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="group bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
            >
              {/* Image + badges */}
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

              {/* Details */}
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
                      ₹{Number(ev.base_price).toLocaleString("en-IN")}
                    </p>
                    {ev.price_per_guest && (
                      <p className="text-gray-400 text-xs">
                        + ₹{Number(ev.price_per_guest).toLocaleString("en-IN")}/guest
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
      </section>
    </div>
  );
}