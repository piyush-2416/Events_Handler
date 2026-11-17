import { useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  MyCommunity – Feedback page                                        */
/*  All data is saved in localStorage, so it stays after a refresh.    */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "eventora_feedbacks";
const LIKES_KEY = "eventora_feedback_likes";

// Header illustration. For best results download it into /public
// (for example /public/feedback-hero.png) and use src="/feedback-hero.png".
const HERO_IMG =
  "https://static.vecteezy.com/system/resources/previews/014/688/762/large_2x/customer-reviews-concept-illustration-people-holding-rating-stars-people-leave-feedback-comments-satisfaction-level-and-positive-vote-modern-flat-cartoon-style-vector.jpg";

const FEATURES = [
  "Homepage",
  "Vendor Listing",
  "Event Booking",
  "Offers & Deals",
  "Chatbot",
  "Notifications",
  "Login / Signup",
  "Payments",
  "Vendor Dashboard",
  "Overall Website",
];

const TYPES = [
  { value: "good", label: "Good", emoji: "👍", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "bad", label: "Needs work", emoji: "👎", chip: "bg-rose-50 text-rose-700 border-rose-200" },
  { value: "idea", label: "Suggestion", emoji: "💡", chip: "bg-amber-50 text-amber-700 border-amber-200" },
];

const ROLES = ["User", "Vendor"];

// Sample feedback so the page is not empty on the first visit.
// Set this to [] if you do not want it.
const SEED = [
  {
    id: "seed-1",
    name: "Aarav Sharma",
    role: "User",
    feature: "Vendor Listing",
    type: "good",
    rating: 5,
    message:
      "The vendor list is very clear. I found a photographer and a decorator in one place, and comparing them was easy.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    helpful: 4,
    mine: false,
  },
  {
    id: "seed-2",
    name: "Royal Caterers",
    role: "Vendor",
    feature: "Vendor Dashboard",
    type: "idea",
    rating: 4,
    message:
      "It would be great to have a separate tab for booking requests in the dashboard. Right now everything shows up mixed together in one list.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    helpful: 2,
    mine: false,
  },
  {
    id: "seed-3",
    name: "Neha Verma",
    role: "User",
    feature: "Payments",
    type: "bad",
    rating: 2,
    message:
      "The confirmation message arrived late after my payment. A status page would have saved me the worry.",
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    helpful: 1,
    mine: false,
  },
];

/* ----------------------------- helpers ----------------------------- */

function loadFeedbacks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Feedback load error:", e);
  }
  return SEED;
}

function loadLikes() {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Likes load error:", e);
  }
  return [];
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 86400 * 30) {
    const d = Math.floor(diff / 86400);
    return `${d} ${d === 1 ? "day" : "days"} ago`;
  }
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

/* ----------------------------- small UI ----------------------------- */

function Star({ filled, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={filled ? "text-amber-400" : "text-slate-300"}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.4l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95L12 2.5z" />
    </svg>
  );
}

function StarDisplay({ value, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} filled={n <= Math.round(value)} size={size} />
      ))}
    </div>
  );
}

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Star filled={n <= (hover || value)} size={30} />
        </button>
      ))}
    </div>
  );
}

/* ------------------------------ main page ------------------------------ */

export default function Feedback({ user }) {
  // user prop is optional: { name: "Piyush Verma", role: "User" }
  const [feedbacks, setFeedbacks] = useState(loadFeedbacks);
  const [likes, setLikes] = useState(loadLikes);

  const [form, setForm] = useState({
    name: user?.name || "",
    role: user?.role === "Vendor" ? "Vendor" : "User",
    feature: FEATURES[0],
    type: "good",
    rating: 0,
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  const [fRole, setFRole] = useState("All");
  const [fType, setFType] = useState("all");
  const [fFeature, setFFeature] = useState("All");
  const [sort, setSort] = useState("latest");

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
    } catch (e) {
      console.error("Feedback save error:", e);
    }
  }, [feedbacks]);

  useEffect(() => {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
    } catch (e) {
      console.error("Likes save error:", e);
    }
  }, [likes]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  /* ------------------------------ stats ------------------------------ */

  const stats = useMemo(() => {
    const total = feedbacks.length;
    const avg = total ? feedbacks.reduce((s, f) => s + f.rating, 0) / total : 0;
    const dist = [5, 4, 3, 2, 1].map((n) => ({
      star: n,
      count: feedbacks.filter((f) => f.rating === n).length,
    }));

    // average rating per feature
    const byFeature = FEATURES.map((name) => {
      const list = feedbacks.filter((f) => f.feature === name);
      return {
        name,
        count: list.length,
        avg: list.length ? list.reduce((s, f) => s + f.rating, 0) / list.length : 0,
      };
    }).filter((f) => f.count > 0);

    const sorted = [...byFeature].sort((a, b) => b.avg - a.avg);
    return { total, avg, dist, best: sorted[0] };
  }, [feedbacks]);

  /* --------------------------- filtered list --------------------------- */

  const visible = useMemo(() => {
    let list = feedbacks.filter(
      (f) =>
        (fRole === "All" || f.role === fRole) &&
        (fType === "all" || f.type === fType) &&
        (fFeature === "All" || f.feature === fFeature)
    );
    if (sort === "latest") list = [...list].sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "helpful") list = [...list].sort((a, b) => b.helpful - a.helpful);
    if (sort === "high") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "low") list = [...list].sort((a, b) => a.rating - b.rating);
    return list;
  }, [feedbacks, fRole, fType, fFeature, sort]);

  /* ------------------------------ actions ------------------------------ */

  const setField = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = "Please enter your name";
    if (!form.rating) err.rating = "Please select a rating";
    if (form.message.trim().length < 10) err.message = "Please write at least 10 characters";
    setErrors(err);
    if (Object.keys(err).length) return;

    const entry = {
      id: `fb-${Date.now()}`,
      name: form.name.trim(),
      role: form.role,
      feature: form.feature,
      type: form.type,
      rating: form.rating,
      message: form.message.trim(),
      createdAt: Date.now(),
      helpful: 0,
      mine: true,
    };
    setFeedbacks((prev) => [entry, ...prev]);
    setForm((p) => ({ ...p, rating: 0, message: "", type: "good" }));
    setToast("Feedback submitted. Thank you!");
  };

  const toggleHelpful = (id) => {
    const already = likes.includes(id);
    setLikes((prev) => (already ? prev.filter((x) => x !== id) : [...prev, id]));
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, helpful: Math.max(0, f.helpful + (already ? -1 : 1)) } : f
      )
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    setToast("Feedback deleted");
  };

  const clearFilters = () => {
    setFRole("All");
    setFType("all");
    setFFeature("All");
    setSort("latest");
  };

  const inputBase =
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400";

  const typeMeta = (value) => TYPES.find((t) => t.value === value) || TYPES[0];

  /* ------------------------------- render ------------------------------- */

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 [color-scheme:light]">
      {/* ---------- Header ---------- */}
{/* ---------- Header ---------- */}
<header className="isolate relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 min-h-[160px] overflow-hidden">  {/* Background image: poore header mein */}
  <img
    src={HERO_IMG}
    alt=""
    aria-hidden="true"
    decoding="async"
    className="-z-20 absolute inset-0 w-full h-full object-center object-cover"
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
  />

  {/* Overlay: text saaf padhne ke liye */}
  <div className="-z-10 absolute inset-0 bg-indigo-900/70 md:bg-transparent md:bg-gradient-to-r md:from-indigo-900/90 md:via-indigo-800/60 md:to-transparent" />

  {/* Text */}
  <div className="relative flex flex-col justify-center mx-auto px-6 sm:px-8 py-14 max-w-6xl min-h-[18rem] md:min-h-[22rem] lg:min-h-[26rem]">
    <h1 className="drop-shadow max-w-xl font-bold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
      Your Feedback Matters
    </h1>
    <p className="drop-shadow mt-3 max-w-lg text-indigo-50 text-base sm:text-lg leading-relaxed">
      Tell us which features you like and which ones need work.
    </p>
  </div>
</header>

      <main className="mx-auto px-6 sm:px-8 py-10 max-w-6xl">
        {/* ---------- Summary ---------- */}
        <section className="gap-6 grid lg:grid-cols-3">
          {/* Average */}
          <div className="bg-white shadow-sm p-6 border border-slate-200 rounded-2xl">
            <p className="font-medium text-slate-600 text-sm">Overall rating</p>
            <div className="flex items-end gap-3 mt-3">
              <span className="font-bold text-slate-900 text-5xl">
                {stats.total ? stats.avg.toFixed(1) : "–"}
              </span>
              <span className="pb-1 text-slate-600 text-sm">/ 5</span>
            </div>
            <div className="mt-3">
              <StarDisplay value={stats.avg} size={20} />
            </div>
            <p className="mt-3 text-slate-600 text-sm">
              You have received {stats.total} {stats.total === 1 ? "feedback" : "feedbacks"}
            </p>
          </div>

          {/* Distribution */}
          <div className="bg-white shadow-sm p-6 border border-slate-200 rounded-2xl">
            <p className="font-medium text-slate-600 text-sm">Rating breakdown</p>
            <div className="space-y-3 mt-4">
              {stats.dist.map((d) => {
                const pct = stats.total ? (d.count / stats.total) * 100 : 0;
                return (
                  <div key={d.star} className="flex items-center gap-3 text-sm">
                    <span className="w-12 text-slate-700">{d.star} star</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-slate-600 text-right">{d.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Favorite feature */}
          <div className="bg-white shadow-sm p-6 border border-slate-200 rounded-2xl">
            <p className="font-medium text-slate-600 text-sm">Feature report</p>
            <div className="space-y-4 mt-4">
              <div className="bg-emerald-50 px-4 py-3 rounded-xl">
                <p className="font-medium text-emerald-700 text-xs">Most Favorite</p>
                <p className="mt-1 font-semibold text-slate-800 text-sm">
                  {stats.best ? stats.best.name : "No data yet"}
                </p>
                {stats.best && (
                  <p className="text-slate-600 text-xs">
                    {stats.best.avg.toFixed(1)} avg · {stats.best.count}{" "}
                    {stats.best.count === 1 ? "review" : "reviews"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Form + List ---------- */}
        <div className="gap-8 grid lg:grid-cols-5 mt-10">
          {/* Form */}
          <section className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="lg:top-6 lg:sticky bg-white shadow-sm p-6 sm:p-8 border border-slate-200 rounded-2xl"
            >
              <h2 className="font-semibold text-slate-900 text-xl">Write Feedback</h2>
              <p className="mt-1 text-slate-600 text-sm">It only takes a minute.</p>

              <div className="space-y-5 mt-6">
                {/* Name */}
                <div>
                  <label htmlFor="fb-name" className="block mb-1.5 font-medium text-slate-700 text-sm">
                    Your name
                  </label>
                  <input
                    id="fb-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="e.g. Piyush Verma"
                    className={`${inputBase} ${errors.name ? "border-rose-400" : "border-slate-300"}`}
                  />
                  {errors.name && <p className="mt-1 text-rose-600 text-xs">{errors.name}</p>}
                </div>

                {/* Role */}
                <div>
                  <span className="block mb-1.5 font-medium text-slate-700 text-sm">Who are you?</span>
                  <div className="gap-3 grid grid-cols-2">
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setField("role", r)}
                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                          form.role === r
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feature */}
                <div>
                  <label htmlFor="fb-feature" className="block mb-1.5 font-medium text-slate-700 text-sm">
                    Which feature is this about?
                  </label>
                  <select
                    id="fb-feature"
                    value={form.feature}
                    onChange={(e) => setField("feature", e.target.value)}
                    className={`${inputBase} border-slate-300`}
                  >
                    {FEATURES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <span className="block mb-1.5 font-medium text-slate-700 text-sm">Type of feedback</span>
                  <div className="gap-3 grid grid-cols-3">
                    {TYPES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setField("type", t.value)}
                        className={`rounded-xl border px-2 py-3 text-xs font-medium transition-colors sm:text-sm ${
                          form.type === t.value
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="mr-1">{t.emoji}</span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <span className="block mb-1 font-medium text-slate-700 text-sm">Rating</span>
                  <StarInput value={form.rating} onChange={(v) => setField("rating", v)} />
                  {errors.rating && <p className="mt-1 text-rose-600 text-xs">{errors.rating}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="fb-msg" className="block mb-1.5 font-medium text-slate-700 text-sm">
                    Your feedback
                  </label>
                  <textarea
                    id="fb-msg"
                    rows={5}
                    maxLength={500}
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    placeholder="What did you like, what didn't work, or what should we add?"
                    className={`${inputBase} resize-none ${
                      errors.message ? "border-rose-400" : "border-slate-300"
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1 text-xs">
                    <span className="text-rose-600">{errors.message || ""}</span>
                    <span className="text-slate-500">{form.message.length}/500</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 hover:from-blue-700 to-indigo-600 hover:to-indigo-700 shadow-sm px-6 py-3.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 w-full font-semibold text-white text-sm transition-colors"
                >
                  Submit feedback
                </button>
              </div>
            </form>
          </section>

          {/* List */}
          <section className="lg:col-span-3">
            {/* Filters */}
            <div className="bg-white shadow-sm p-5 sm:p-6 border border-slate-200 rounded-2xl">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="font-semibold text-slate-900 text-xl">
                  All feedback{" "}
                  <span className="font-normal text-slate-500 text-base">({visible.length})</span>
                </h2>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort feedback"
                  className="bg-white px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 text-sm"
                >
                  <option value="latest">Latest</option>
                  <option value="helpful">Most helpful</option>
                  <option value="high">Highest rating</option>
                  <option value="low">Lowest rating</option>
                </select>
              </div>

              <div className="space-y-4 mt-5">
                {/* Role filter */}
                <div className="flex flex-wrap gap-2">
                  {["All", ...ROLES].map((r) => (
                    <button
                      key={r}
                      onClick={() => setFRole(r)}
                      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                        fRole === r
                          ? "border-indigo-500 bg-indigo-600 text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {r === "All" ? "Everyone" : r}
                    </button>
                  ))}
                </div>

                {/* Type filter */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFType("all")}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      fType === "all"
                        ? "border-indigo-500 bg-indigo-600 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    All types
                  </button>
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setFType(t.value)}
                      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                        fType === t.value
                          ? "border-indigo-500 bg-indigo-600 text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {t.emoji} {t.label}
                    </button>
                  ))}
                </div>

                {/* Feature filter */}
                <select
                  value={fFeature}
                  onChange={(e) => setFFeature(e.target.value)}
                  aria-label="Filter by feature"
                  className="bg-white px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full sm:w-64 text-slate-700 text-sm"
                >
                  <option value="All">All features</option>
                  {FEATURES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-5 mt-6">
              {visible.length === 0 && (
                <div className="bg-white px-6 py-14 border border-slate-300 border-dashed rounded-2xl text-center">
                  <p className="font-medium text-slate-800 text-base">No feedback found</p>
                  <p className="mt-1 text-slate-600 text-sm">
                    Try changing the filters, or write the first feedback yourself.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="hover:bg-slate-50 mt-5 px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 text-sm"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {visible.map((f) => {
                const meta = typeMeta(f.type);
                const liked = likes.includes(f.id);
                return (
                  <article
                    key={f.id}
                    className="bg-white shadow-sm p-6 sm:p-7 border border-slate-200 rounded-2xl"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-500 rounded-full w-11 h-11 font-semibold text-white text-sm shrink-0">
                          {initials(f.name) || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {f.name}
                            {f.mine && (
                              <span className="bg-slate-100 ml-2 px-2 py-0.5 rounded-full font-normal text-slate-600 text-xs">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-slate-600 text-xs">
                            <span
                              className={
                                f.role === "Vendor" ? "font-medium text-purple-700" : "font-medium text-blue-700"
                              }
                            >
                              {f.role}
                            </span>{" "}
                            • {timeAgo(f.createdAt)}
                          </p>
                        </div>
                      </div>
                      <StarDisplay value={f.rating} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      <span className="bg-slate-50 px-3 py-1 border border-slate-200 rounded-full font-medium text-slate-700 text-xs">
                        {f.feature}
                      </span>
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${meta.chip}`}>
                        {meta.emoji} {meta.label}
                      </span>
                    </div>

                    <p className="mt-4 text-slate-800 text-sm leading-relaxed">{f.message}</p>

                    <div className="flex justify-between items-center mt-5 pt-4 border-slate-100 border-t">
                      <button
                        onClick={() => toggleHelpful(f.id)}
                        aria-pressed={liked}
                        className={`rounded-lg border px-3.5 py-2 text-sm transition-colors ${
                          liked
                            ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                            : "border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        👍 Helpful ({f.helpful})
                      </button>

                      {f.mine && (
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="hover:bg-rose-50 px-3 py-2 rounded-lg text-rose-600 text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* ---------- Toast ---------- */}
      {toast && (
        <div
          role="status"
          className="bottom-6 left-1/2 z-50 fixed bg-slate-900 shadow-lg px-5 py-3 rounded-xl text-white text-sm -translate-x-1/2"
        >
          {toast}
        </div>
      )}
    </div>
  );
}