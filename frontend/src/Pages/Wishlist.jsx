import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

/* =====================================================================
   WISHLIST STORE (hook)  ->  Eventsid.jsx me bhi isi se import hota hai:
   import { useWishlist } from "./Wishlist";
   ===================================================================== */
const KEY = "eventora_wishlist";
const MAX_ITEMS = 100;

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

// Sirf safe image links allow: http(s) ya data:image
const safeImage = (u) => {
  const s = String(u || "").trim();
  return /^https?:\/\//i.test(s) || /^data:image\//i.test(s) ? s : "";
};

// Storage se aaya har item saaf karo (galat data ho to null)
const clean = (x) => {
  if (!x || typeof x !== "object") return null;
  const id = x.id ?? x._id;
  const title = String(x.title ?? "").trim();
  if (id === undefined || id === null || id === "" || !title) return null;
  return {
    id: String(id),
    title: title.slice(0, 120),
    image_url: safeImage(x.image_url),
    category_name: String(x.category_name ?? "").trim().slice(0, 40),
    base_price: num(x.base_price),
    price_per_guest: num(x.price_per_guest),
    min_guests: num(x.min_guests),
    max_guests: num(x.max_guests),
    duration_hours: x.duration_hours === "" || x.duration_hours == null ? "" : num(x.duration_hours),
    savedAt: num(x.savedAt) || Date.now(),
  };
};

const read = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (!Array.isArray(raw)) return [];
    const seen = new Set();
    return raw
      .map(clean)
      .filter((x) => x && !seen.has(x.id) && seen.add(x.id));
  } catch {
    return [];
  }
};

// true = save ho gaya, false = storage full / blocked
const write = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    return false;
  }
  window.dispatchEvent(new Event("wishlist-change")); // same tab sync
  return true;
};

export function useWishlist() {
  const [items, setItems] = useState(read);

  useEffect(() => {
    const sync = () => setItems(read());
    window.addEventListener("wishlist-change", sync);
    window.addEventListener("storage", sync); // dusre tab ke liye
    return () => {
      window.removeEventListener("wishlist-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // latest storage se check karo (stale state ka darr nahi)
  const has = useCallback(
    (id) => id != null && read().some((x) => x.id === String(id)),
    // items badalne par component dobara render ho, isliye dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items]
  );

  // return: "added" | "exists" | "invalid" | "full" | "error"
  const add = useCallback((event) => {
    const item = clean({ ...event, savedAt: Date.now() });
    if (!item) return "invalid";
    const cur = read();
    if (cur.some((x) => x.id === item.id)) return "exists";
    if (cur.length >= MAX_ITEMS) return "full";
    return write([item, ...cur]) ? "added" : "error";
  }, []);

  const remove = useCallback((id) => {
    return write(read().filter((x) => x.id !== String(id)));
  }, []);

  // return: "added" | "removed" | "invalid" | "full" | "error"
  const toggle = useCallback(
    (event) => {
      const id = event?.id ?? event?._id;
      if (id == null) return "invalid";
      if (read().some((x) => x.id === String(id))) {
        return remove(id) ? "removed" : "error";
      }
      const r = add(event);
      return r === "exists" ? "added" : r;
    },
    [add, remove]
  );

  const clear = useCallback(() => write([]), []);

  return { items, has, add, remove, toggle, clear };
}

/* =====================================================================
   WISHLIST PAGE
   ===================================================================== */
const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const hideBrokenImage = (e) => {
  e.target.style.display = "none";
};

// Event detail page ka sahi route (App.jsx me: /Eventsid/:id)
const eventLink = (id) => `/Eventsid/${encodeURIComponent(id)}`;

const Icon = ({ d, className = "w-4 h-4", fill = "none" }) => (
  <svg
    viewBox="0 0 24 24"
    fill={fill}
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
  heart: "M12 21s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.6-7 10-7 10z",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3",
  users:
    "M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 6.5M18 14a6.5 6.5 0 013.5 6",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  arrow: "M5 12h14M13 6l6 6-6 6",
};

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');
.wl-root { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
.wl-display { font-family: 'Bricolage Grotesque', 'DM Sans', ui-sans-serif, sans-serif; letter-spacing: -0.02em; }
`;

export default function Wishlist() {
  const { items, remove, clear } = useWishlist();
  const [confirmClear, setConfirmClear] = useState(false);
  const [error, setError] = useState("");

  const onRemove = (id) => {
    setError("");
    if (!remove(id)) setError("Hata nahi paya. Browser storage band ya full hai.");
  };

  const onClear = () => {
    setError("");
    if (!clear()) setError("Wishlist saaf nahi ho paayi. Browser storage band ya full hai.");
    setConfirmClear(false);
  };

  return (
    <div className="flex flex-col bg-stone-50 min-h-screen text-slate-800 wl-root">
      <style>{styles}</style>
      <Navbar />

      <main className="flex-grow mx-auto px-4 py-10 w-full max-w-6xl">
        {/* ---------- heading ---------- */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <h1 className="font-extrabold text-slate-900 text-3xl sm:text-4xl wl-display">
              Meri Wishlist
            </h1>
            <p className="mt-2 text-slate-500 text-sm">
              {items.length > 0
                ? `${items.length} event${items.length > 1 ? "s" : ""} save kiye hain`
                : "Jo events pasand aaye, unhe yahan save karo."}
            </p>
          </div>

          {items.length > 0 &&
            (confirmClear ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClear}
                  className="bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-full font-semibold text-white text-sm transition-colors"
                >
                  Haan, sab hatao
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="hover:bg-slate-100 px-4 py-2 rounded-full ring-1 ring-slate-300 font-semibold text-slate-700 text-sm transition-colors"
                >
                  Nahi
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="hover:bg-rose-50 px-4 py-2 rounded-full ring-1 ring-slate-300 hover:ring-rose-200 font-semibold text-slate-700 hover:text-rose-600 text-sm transition-colors"
              >
                Sab hatao
              </button>
            ))}
        </div>

        {error && (
          <p role="alert" className="bg-rose-50 mb-6 px-4 py-3 rounded-xl ring-1 ring-rose-200 text-rose-700 text-sm">
            {error}
          </p>
        )}

        {/* ---------- empty ---------- */}
        {items.length === 0 ? (
          <div className="bg-white px-6 py-16 border border-slate-300 border-dashed rounded-3xl text-center">
            <div className="flex justify-center items-center bg-rose-50 mx-auto mb-4 rounded-full w-16 h-16 text-rose-500">
              <Icon d={ICONS.heart} className="w-8 h-8" />
            </div>
            <h2 className="font-bold text-slate-900 text-xl wl-display">Wishlist abhi khali hai</h2>
            <p className="mx-auto mt-2 max-w-sm text-slate-500 text-sm">
              Kisi event ke page par heart button dabao, wo yahan aa jayega.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 mt-6 px-6 py-3 rounded-full font-semibold text-white text-sm transition-colors"
            >
              Events dekho <Icon d={ICONS.arrow} />
            </Link>
          </div>
        ) : (
          /* ---------- list ---------- */
          <ul className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
            {items.map((e) => (
              <li
                key={e.id}
                className="flex flex-col bg-white shadow-sm hover:shadow-md rounded-2xl ring-1 ring-slate-200 overflow-hidden transition-shadow"
              >
                <Link to={eventLink(e.id)} className="block relative bg-slate-200 h-44 overflow-hidden">
                  {e.image_url ? (
                    <img
                      src={e.image_url}
                      alt={e.title}
                      onError={hideBrokenImage}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex justify-center items-center bg-gradient-to-br from-slate-800 to-indigo-900 w-full h-full">
                      <span className="font-extrabold text-white/20 text-6xl wl-display">{e.title[0]}</span>
                    </div>
                  )}
                  {e.category_name && (
                    <span className="top-3 left-3 absolute bg-amber-400 px-3 py-1 rounded-full font-semibold text-slate-900 text-xs">
                      {e.category_name}
                    </span>
                  )}
                </Link>

                <div className="flex flex-col flex-grow gap-3 p-5">
                  <Link to={eventLink(e.id)}>
                    <h2 className="font-bold text-slate-900 hover:text-indigo-600 text-lg leading-snug transition-colors wl-display">
                      {e.title}
                    </h2>
                  </Link>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-xs">
                    {(e.min_guests > 0 || e.max_guests > 0) && (
                      <span className="inline-flex items-center gap-1">
                        <Icon d={ICONS.users} className="w-3.5 h-3.5" />
                        {e.min_guests} – {e.max_guests} guests
                      </span>
                    )}
                    {e.duration_hours !== "" && e.duration_hours > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Icon d={ICONS.clock} className="w-3.5 h-3.5" />
                        {e.duration_hours} hrs
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 text-sm">
                    Starting <b className="text-slate-900 text-base">{rupee(e.base_price)}</b>
                    {e.price_per_guest > 0 && ` + ${rupee(e.price_per_guest)} / guest`}
                  </p>

                  <div className="flex items-center gap-2 mt-auto pt-3">
                    <Link
                      to={eventLink(e.id)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-xl font-semibold text-white text-sm text-center transition-colors"
                    >
                      Details dekho
                    </Link>
                    <button
                      type="button"
                      onClick={() => onRemove(e.id)}
                      aria-label={`${e.title} ko wishlist se hatao`}
                      title="Wishlist se hatao"
                      className="flex justify-center items-center hover:bg-rose-50 rounded-xl ring-1 ring-slate-300 hover:ring-rose-200 w-11 h-11 text-slate-500 hover:text-rose-600 transition-colors"
                    >
                      <Icon d={ICONS.trash} className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* <Footer /> */}
    </div>
  );
}