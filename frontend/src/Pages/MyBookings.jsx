import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const STATUS = {
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelled", cls: "bg-slate-200 text-slate-700" },
};

const FILTERS = [
  ["all", "All"],
  ["pending", "Pending"],
  ["confirmed", "Confirmed"],
  ["cancelled", "Cancelled"],
];

// Item ka detail page kaunsa hai (App.jsx ke routes ke hisaab se)
const detailPath = (b) => {
  if (b.item_type === "event") return `/Eventsid/${b.item_id}`;
  if (b.item_type === "vendor") return `/Vendorsid/${b.item_id}`;
  if (b.item_type === "venue") return `/Venuesid/${b.item_id}`;
  return "/packages";
};

const TYPE_ICON = { event: "🎉", vendor: "🧑‍🍳", venue: "🏛️", package: "🎁" };

// "2026-11-20" ko timezone ke jhanjhat ke bina dikhao
const prettyDate = (s) => {
  const [y, m, d] = String(s).split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function MyBookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [cancelId, setCancelId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    setError("");
    api
      .get("/bookings/mine")
      .then((res) => setList(Array.isArray(res.data) ? res.data : []))
      .catch((e) =>
        setError(e.response?.data?.error || "Could not load your bookings")
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const counts = useMemo(() => {
    const c = { all: list.length };
    list.forEach((b) => (c[b.status] = (c[b.status] || 0) + 1));
    return c;
  }, [list]);

  const rows = useMemo(
    () => (filter === "all" ? list : list.filter((b) => b.status === filter)),
    [list, filter]
  );

  const cancel = async (id) => {
    setBusyId(id);
    setError("");
    try {
      const res = await api.patch(`/bookings/${id}/cancel`);
      setList((prev) => prev.map((b) => (b.id === id ? res.data : b)));
    } catch (e) {
      setError(e.response?.data?.error || "Could not cancel this booking");
    } finally {
      setBusyId(null);
      setCancelId(null);
    }
  };

  return (
    <div className="flex flex-col bg-stone-50 pt-20 min-h-screen text-slate-900 text-left [color-scheme:light]">
      <Navbar />

      <main className="flex-grow mx-auto px-4 py-8 w-full max-w-4xl">
        <div className="flex flex-wrap justify-between items-end gap-3">
          <div>
            <h1 className="font-extrabold text-3xl">My Bookings</h1>
            <p className="mt-1 text-slate-600 text-sm">
              Only your own bookings are shown here.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="hover:bg-white disabled:opacity-60 px-4 py-2 rounded-lg ring-1 ring-slate-300 font-semibold text-slate-700 text-sm"
          >
            {loading ? "Loading..." : "🔄 Refresh"}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-6">
          {FILTERS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filter === id
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {label} ({counts[id] || 0})
            </button>
          ))}
        </div>

        {error && (
          <p role="alert" className="bg-red-50 mt-5 p-3 rounded-xl text-red-700 text-sm">
            ⚠️ {error}
          </p>
        )}

        {loading && list.length === 0 && (
          <div className="space-y-4 mt-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-slate-200 rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && !error && rows.length === 0 && (
          <div className="bg-white mt-8 px-6 py-14 border border-slate-300 border-dashed rounded-2xl text-center">
            <p className="font-semibold text-lg">
              {list.length === 0 ? "No bookings yet" : "No bookings in this filter"}
            </p>
            <p className="mt-1 text-slate-600 text-sm">
              {list.length === 0
                ? "Pick an event, vendor, venue or package and book it."
                : "Try a different filter."}
            </p>
            {list.length === 0 && (
              <Link
                to="/events"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 mt-5 px-6 py-3 rounded-xl font-semibold text-white text-sm"
              >
                Browse events
              </Link>
            )}
          </div>
        )}

        <ul className="space-y-4 mt-6">
          {rows.map((b) => {
            const st = STATUS[b.status] || STATUS.pending;
            const canCancel = b.status !== "cancelled";
            return (
              <li
                key={b.id}
                className="flex sm:flex-row flex-col sm:items-center gap-4 bg-white shadow-sm p-4 border border-slate-200 rounded-2xl"
              >
                <div className="bg-slate-100 rounded-xl w-full sm:w-28 h-20 overflow-hidden shrink-0">
                  {b.item_image ? (
                    <img
                      src={b.item_image}
                      alt={b.item_title}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-full text-3xl">
                      {TYPE_ICON[b.item_type] || "📅"}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-slate-100 px-2.5 py-0.5 rounded-full font-semibold text-slate-700 text-xs capitalize">
                      {TYPE_ICON[b.item_type]} {b.item_type}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.cls}`}>
                      {st.label}
                    </span>
                  </div>
                  <h2 className="mt-1.5 font-bold text-lg break-words">{b.item_title}</h2>
                  <p className="mt-0.5 text-slate-700 text-sm">
                    📅 {prettyDate(b.booking_date)}
                    {b.guests ? ` · 👥 ${b.guests} guests` : ""}
                  </p>
                  {b.note && <p className="mt-1 text-slate-600 text-sm break-words">“{b.note}”</p>}
                </div>

                <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                  <Link
                    to={detailPath(b)}
                    className="hover:bg-slate-50 px-4 py-2 rounded-lg ring-1 ring-slate-300 font-semibold text-slate-700 text-sm text-center"
                  >
                    View
                  </Link>

                  {canCancel &&
                    (cancelId === b.id ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => cancel(b.id)}
                          disabled={busyId === b.id}
                          className="bg-red-600 hover:bg-red-700 disabled:opacity-60 px-3 py-2 rounded-lg font-semibold text-white text-sm"
                        >
                          {busyId === b.id ? "..." : "Yes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancelId(null)}
                          disabled={busyId === b.id}
                          className="hover:bg-slate-50 px-3 py-2 rounded-lg ring-1 ring-slate-300 font-semibold text-slate-700 text-sm"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCancelId(b.id)}
                        className="hover:bg-red-50 px-4 py-2 rounded-lg ring-1 ring-red-200 font-semibold text-red-700 text-sm"
                      >
                        Cancel
                      </button>
                    ))}
                </div>
              </li>
            );
          })}
        </ul>
      </main>

      {/* <Footer /> */}
    </div>
  );
}