import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* =====================================================================
   ListingKit: Events / Vendors / Venues teeno listing pages ke shared parts.
   Isko  src/Components/ListingKit.jsx  me rakho.
   ===================================================================== */

export const fmt = (n) => Number(n || 0).toLocaleString("en-IN");
export const asArray = (v) => (Array.isArray(v) ? v : []);
export const hideBrokenImage = (e) => {
  e.target.style.display = "none";
};

/* ---------- inline icons ---------- */
export const Icon = ({ d, className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
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
export const ICONS = {
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3",
  filter: "M4 6h16M7 12h10M10 18h4",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z",
  pin: "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z",
  users:
    "M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 6.5M18 14a6.5 6.5 0 013.5 6",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  award: "M12 14a5 5 0 100-10 5 5 0 000 10zM8.5 13.5L7 21l5-3 5 3-1.5-7.5",
  phone:
    "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6L6 18",
  arrow: "M5 12h14M13 6l6 6-6 6",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM8.5 12.5l2.5 2.5 4.5-5",
};

/* ---------- styles: hero ka ek orchestrated moment + card entrance ---------- */
export const listingStyles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');

.ls-root { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
.ls-display { font-family: 'Bricolage Grotesque', 'DM Sans', ui-sans-serif, sans-serif; letter-spacing: -0.02em; }

@keyframes ls-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes ls-zoom { from { transform: scale(1); } to { transform: scale(1.1); } }
@keyframes ls-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }

.ls-hero-1 { animation: ls-rise .7s .1s  cubic-bezier(.2,.7,.2,1) both; }
.ls-hero-2 { animation: ls-rise .7s .22s cubic-bezier(.2,.7,.2,1) both; }
.ls-hero-3 { animation: ls-rise .7s .34s cubic-bezier(.2,.7,.2,1) both; }
.ls-zoom   { animation: ls-zoom 7s ease-out forwards; }
.ls-progress { transform-origin: left; animation: ls-progress 6s linear forwards; }
.ls-card   { animation: ls-rise .5s cubic-bezier(.2,.7,.2,1) both; animation-delay: var(--d, 0ms); }

@keyframes ls-pop { from { opacity: 0; transform: translateY(-6px) scale(.98); } to { opacity: 1; transform: none; } }
.ls-pop { transform-origin: top left; animation: ls-pop .18s ease-out both; }

@media (prefers-reduced-motion: reduce) {
  .ls-hero-1, .ls-hero-2, .ls-hero-3, .ls-zoom, .ls-progress, .ls-card, .ls-pop { animation: none; }
}
`;

/* =====================================================================
   HERO: crossfade slider + search bar.
   Slide badalna progress bar ke animationend se hota hai, isliye hover par
   pause apne aap ho jata hai aur reduced-motion me auto-advance band rehta hai.
   ===================================================================== */
export function ListingHero({ slides, title, subtitle, search, onSearch, placeholder }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goToListing = (e) => {
    e.preventDefault();
    document.getElementById("listing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="relative bg-slate-900 h-[75vh] min-h-[30rem] max-h-[40rem] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          loading={i === 0 ? "eager" : "lazy"}
          onError={hideBrokenImage}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1400ms] motion-reduce:transition-none ${
            i === active ? "opacity-100 ls-zoom" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/10" />
      <div className="right-0 bottom-0 left-0 absolute bg-gradient-to-t from-slate-950/60 to-transparent h-32" />

      <div className="relative flex items-center mx-auto px-4 max-w-7xl h-full">
        <div className="max-w-2xl text-white">
          <h1 className="font-extrabold text-4xl sm:text-6xl leading-[1.05] ls-display ls-hero-1">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-white/80 text-base sm:text-lg ls-hero-2">{subtitle}</p>

          <form
            onSubmit={goToListing}
            className="flex items-center gap-2 bg-white shadow-slate-950/20 shadow-xl mt-8 p-1.5 rounded-full max-w-lg ls-hero-3"
          >
            <Icon d={ICONS.search} className="flex-shrink-0 ml-3 w-5 h-5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={placeholder}
              aria-label="Search"
              className="flex-1 bg-transparent px-1 py-2 outline-none min-w-0 text-slate-800 placeholder:text-slate-400 text-sm"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-full font-semibold text-white text-sm transition-colors"
            >
              Dhundho
            </button>
          </form>
        </div>
      </div>

      {/* thumbnails */}
      <div className="hidden right-4 md:right-8 bottom-6 absolute sm:flex gap-2">
        {slides.map((s, i) => (
          <button
            key={s.src}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === active}
            className={`h-14 w-20 overflow-hidden rounded-lg ring-2 transition focus:outline-none focus-visible:ring-white ${
              i === active ? "ring-white" : "ring-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img src={s.src} alt="" onError={hideBrokenImage} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* progress line: khatam hote hi agli slide */}
      <div className="right-0 bottom-0 left-0 absolute bg-white/15 h-1">
        <div
          key={active}
          className="bg-amber-400 w-full h-full ls-progress"
          style={{ animationPlayState: paused ? "paused" : "running" }}
          onAnimationEnd={() => setActive((i) => (i + 1) % slides.length)}
        />
      </div>
    </header>
  );
}

/* =====================================================================
   FILTER PARTS
   ===================================================================== */
export const inputCls =
  "w-full rounded-xl bg-stone-50 px-3.5 py-2.5 text-sm text-slate-800 ring-1 ring-slate-200 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500";

export function FilterPanel({ activeCount, onReset, children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="lg:hidden flex items-center self-start gap-2 bg-white hover:bg-stone-50 px-4 py-2.5 rounded-full ring-1 ring-slate-200 font-medium text-sm transition-colors"
      >
        <Icon d={ICONS.filter} /> Filters
        {activeCount > 0 && (
          <span className="bg-indigo-600 px-2 rounded-full text-white text-xs">{activeCount}</span>
        )}
      </button>

      <aside className={`${open ? "block" : "hidden"} lg:block lg:w-72 shrink-0`}>
        <div className="lg:top-24 lg:sticky space-y-6 bg-white p-5 rounded-2xl ring-1 ring-slate-200">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-xl ls-display">Filters</h3>
            <button
              onClick={onReset}
              className="text-slate-500 hover:text-indigo-600 text-sm transition-colors"
            >
              Reset
            </button>
          </div>
          {children}
        </div>
      </aside>
    </>
  );
}

export const Field = ({ label, children }) => (
  <div>
    <p className="mb-2 font-semibold text-slate-800 text-sm">{label}</p>
    {children}
  </div>
);

export const Segmented = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(([val, label]) => (
      <button
        key={String(val)}
        type="button"
        onClick={() => onChange(val)}
        aria-pressed={value === val}
        className={`rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition-colors ${
          value === val
            ? "bg-slate-900 text-white ring-slate-900"
            : "bg-white text-slate-600 ring-slate-200 hover:ring-slate-400"
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

export const Toggle = ({ checked, onChange, children }) => (
  <label className="flex justify-between items-center gap-3 text-slate-700 text-sm cursor-pointer">
    <span>{children}</span>
    <span className="relative">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="block bg-slate-200 peer-checked:bg-indigo-600 rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400 peer-focus-visible:ring-offset-2 w-11 h-6 transition-colors" />
      <span className="top-0.5 left-0.5 absolute bg-white shadow rounded-full w-5 h-5 transition-transform peer-checked:translate-x-5 pointer-events-none" />
    </span>
  </label>
);

/* =====================================================================
   RESULTS PARTS
   ===================================================================== */
export function ChipRow({ items, value, onChange, total }) {
  const base = "rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors";
  const on = "bg-slate-900 text-white ring-slate-900";
  const off = "bg-white text-slate-700 ring-slate-200 hover:ring-indigo-400 hover:text-indigo-600";
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => onChange("all")} className={`${base} ${value === "all" ? on : off}`}>
        All <span className="opacity-60">{total}</span>
      </button>
      {items.map(({ key, label, count }) => (
        <button key={key} onClick={() => onChange(key)} className={`${base} ${value === key ? on : off}`}>
          {label} <span className="opacity-60">{count}</span>
        </button>
      ))}
    </div>
  );
}

/* =====================================================================
   CHIP PICKER: sirf top `limit` chips dikhte hain (sabse zyada count wale),
   baaki "+N more" ke popover me, search ke saath. Select ki hui value hamesha
   chips me dikhti rehti hai, chahe wo top me na ho.
   ===================================================================== */
export function ChipPicker({
  items, // [{ key, label, count }]
  value,
  onChange,
  total,
  limit = 5,
  placeholder = "Search...",
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const wrap = useRef(null);

  // bahar click ya Escape par band
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const top = [...items]
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
  const selected = items.find((i) => i.key === value);
  const visible =
    selected && !top.some((t) => t.key === value)
      ? [...top.slice(0, Math.max(limit - 1, 0)), selected]
      : top;
  const rest = items.length - visible.length;
  const matches = items.filter((i) =>
    i.label.toLowerCase().includes(q.trim().toLowerCase())
  );

  const base = "rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors";
  const on = "bg-slate-900 text-white ring-slate-900";
  const off = "bg-white text-slate-700 ring-slate-200 hover:ring-indigo-400 hover:text-indigo-600";

  const pick = (key) => {
    onChange(key);
    setOpen(false);
    setQ("");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={() => pick("all")} className={`${base} ${value === "all" ? on : off}`}>
        All <span className="opacity-60">{total}</span>
      </button>

      {visible.map(({ key, label, count }) => (
        <button key={key} onClick={() => pick(key)} className={`${base} ${value === key ? on : off}`}>
          {label} <span className="opacity-60">{count}</span>
        </button>
      ))}

      {rest > 0 && (
        <div ref={wrap} className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-haspopup="listbox"
            className={`${base} inline-flex items-center gap-1.5 ${
              open ? "bg-indigo-50 text-indigo-700 ring-indigo-300" : "bg-stone-100 text-slate-600 ring-transparent hover:bg-stone-200"
            }`}
          >
            +{rest} more
            <Icon
              d="M6 9l6 6 6-6"
              className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="top-full left-0 z-20 absolute bg-white shadow-slate-900/10 shadow-xl mt-2 p-3 rounded-2xl ring-1 ring-slate-200 w-72 ls-pop">
              <div className="relative">
                <Icon
                  d={ICONS.search}
                  className="top-1/2 left-3 absolute w-4 h-4 text-slate-400 -translate-y-1/2"
                />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={placeholder}
                  className={`${inputCls} pl-9`}
                />
              </div>

              <ul role="listbox" className="space-y-0.5 mt-2 pr-1 max-h-64 overflow-y-auto">
                {matches.map(({ key, label, count }) => (
                  <li key={key}>
                    <button
                      role="option"
                      aria-selected={value === key}
                      onClick={() => pick(key)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        value === key
                          ? "bg-indigo-50 font-semibold text-indigo-700"
                          : "text-slate-700 hover:bg-stone-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {value === key && <Icon d={ICONS.check} className="w-4 h-4" />}
                        {label}
                      </span>
                      <span className="text-slate-400 text-xs">{count}</span>
                    </button>
                  </li>
                ))}
                {matches.length === 0 && (
                  <li className="px-3 py-4 text-slate-400 text-sm text-center">Kuch nahi mila</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const ResultsHeader = ({ title, count, onShowAll }) => (
  <div className="flex justify-between items-end mb-4">
    <h2 className="font-bold text-slate-900 text-2xl sm:text-3xl ls-display">
      {title}
      <span className="ml-2 font-medium text-slate-400 text-lg">{count}</span>
    </h2>
    {onShowAll && (
      <button onClick={onShowAll} className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">
        Show all
      </button>
    )}
  </div>
);

export const ActiveChips = ({ chips }) =>
  chips.length === 0 ? null : (
    <div className="flex flex-wrap gap-2 mb-5">
      {chips.map((c) => (
        <button
          key={c.label}
          onClick={c.onClear}
          className="group inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full font-medium text-indigo-700 text-xs transition-colors"
        >
          {c.label}
          <Icon d={ICONS.x} className="opacity-60 group-hover:opacity-100 w-3 h-3" />
        </button>
      ))}
    </div>
  );

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl ring-1 ring-slate-200 overflow-hidden animate-pulse">
    <div className="bg-slate-200 h-52" />
    <div className="space-y-3 p-5">
      <div className="bg-slate-200 rounded w-2/3 h-5" />
      <div className="bg-slate-200 rounded w-1/3 h-3" />
      <div className="bg-slate-200 rounded w-full h-3" />
      <div className="bg-slate-200 rounded w-4/5 h-3" />
    </div>
  </div>
);

export const EmptyState = ({ text, onReset }) => (
  <div className="bg-white py-16 rounded-2xl ring-1 ring-slate-200 text-center">
    <p className="text-slate-500">{text}</p>
    <button
      onClick={onReset}
      className="bg-slate-900 hover:bg-indigo-600 mt-4 px-5 py-2.5 rounded-full font-medium text-white text-sm transition-colors"
    >
      Filters reset karo
    </button>
  </div>
);

/* ---------- card + card ke buttons ---------- */
export const ViewButton = ({ to }) => (
  <Link
    to={to}
    className="group/btn inline-flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 px-4 py-2.5 rounded-xl font-semibold text-white text-sm transition-colors"
  >
    View details
    <Icon d={ICONS.arrow} className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
  </Link>
);

export const IconLink = ({ href, label, icon }) => (
  <a
    href={href}
    aria-label={label}
    className="flex justify-center items-center bg-stone-100 hover:bg-indigo-600 rounded-xl w-10 h-10 text-slate-600 hover:text-white transition-colors"
  >
    <Icon d={icon} />
  </a>
);

export function ListingCard({
  index = 0,
  to,
  image,
  alt,
  badge,
  topRight,
  title,
  location,
  description,
  meta = [],
  tags = [],
  tagLimit = 3,
  footer,
}) {
  return (
    <article
      className="group flex flex-col bg-white hover:shadow-slate-900/10 hover:shadow-xl rounded-2xl ring-1 ring-slate-200 hover:ring-slate-300 overflow-hidden transition hover:-translate-y-1 duration-300 ls-card"
      style={{ "--d": `${Math.min(index, 8) * 60}ms` }}
    >
      <Link to={to} className="block relative bg-slate-200 h-52 overflow-hidden">
        <img
          src={image}
          alt={alt}
          onError={hideBrokenImage}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
        {badge && (
          <span className="top-3 left-3 absolute bg-amber-400 px-3 py-1 rounded-full font-semibold text-slate-900 text-xs">
            {badge}
          </span>
        )}
        {topRight}
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-slate-900 text-xl leading-snug ls-display">
          <Link to={to} className="hover:text-indigo-600 transition-colors">
            {title}
          </Link>
        </h3>

        {location && (
          <p className="flex items-start gap-1.5 mt-1.5 text-slate-500 text-xs">
            <Icon d={ICONS.pin} className="flex-shrink-0 mt-px w-3.5 h-3.5" />
            <span>{location}</span>
          </p>
        )}

        {description && (
          <p className="mt-3 text-slate-600 text-sm line-clamp-2 leading-relaxed">{description}</p>
        )}

        {meta.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-slate-600 text-sm">
            {meta.map((m, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                <Icon d={m.icon} className={`h-4 w-4 ${m.iconClass || "text-slate-400"}`} />
                {m.text}
              </span>
            ))}
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {tags.slice(0, tagLimit).map((t, i) => (
              <span key={`${t}-${i}`} className="bg-stone-100 px-2.5 py-1 rounded-full text-slate-600 text-xs">
                {t}
              </span>
            ))}
            {tags.length > tagLimit && (
              <span className="bg-stone-100 px-2.5 py-1 rounded-full text-slate-400 text-xs">
                +{tags.length - tagLimit}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-5">
          <div className="pt-4 border-slate-100 border-t">{footer}</div>
        </div>
      </div>
    </article>
  );
}
