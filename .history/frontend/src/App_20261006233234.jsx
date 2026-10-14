import { useEffect, useRef, useState } from "react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const categories = [
  { name: "Weddings", sub: "Make it magical", icon: "💍", bg: "bg-rose-50" },
  { name: "Birthdays", sub: "Celebrate life", icon: "🎂", bg: "bg-orange-50" },
  { name: "Corporate", sub: "Build together", icon: "💼", bg: "bg-sky-50" },
  { name: "Engagement", sub: "Say yes", icon: "💖", bg: "bg-pink-50" },
  { name: "Anniversary", sub: "Cherish moments", icon: "🥂", bg: "bg-sky-100" },
  { name: "Baby Shower", sub: "Little beginnings", icon: "🍼", bg: "bg-teal-50" },
  { name: "Parties", sub: "Good vibes", icon: "🎉", bg: "bg-amber-50" },
  { name: "Festivals", sub: "Feel the culture", icon: "🪔", bg: "bg-yellow-50" },
  { name: "Exhibitions", sub: "Explore & grow", icon: "🏛️", bg: "bg-sky-50" },
  { name: "More", sub: "& much more", icon: "🔳", bg: "bg-sky-100" },
];

const features = [
  { title: "Verified Vendors", text: "Trusted & reviewed professionals", icon: "🛡️", bg: "bg-sky-50" },
  { title: "Wide Range of Events", text: "From weddings to corporate events", icon: "📅", bg: "bg-sky-100" },
  { title: "Easy Booking", text: "Simple, secure & hassle-free", icon: "⚡", bg: "bg-amber-50" },
  { title: "Custom Packages", text: "Tailored to your needs & budget", icon: "📦", bg: "bg-orange-50" },
  { title: "Live Support", text: "We're here when you need us", icon: "🎧", bg: "bg-pink-50" },
  { title: "Exclusive Offers", text: "Special deals & early access", icon: "🎁", bg: "bg-rose-50" },
];

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative">
      <img
        src="/Event_Handler_bigImage.png"
        alt="Your Perfect Event Starts Here"
        className="block h-auto w-full rounded-b-3xl object-cover shadow-lg shadow-sky-200/60 sm:rounded-b-[2.5rem]"
        fetchpriority="high"
      />
    </section>
  );
}

/* ---------- EVENT CATEGORIES ---------- */
function EventCategories() {
  return (
    <section className="relative z-10 -mt-5 px-4 pb-6 sm:-mt-10">
      <div className="mx-auto max-w-6xl rounded-3xl border border-sky-100 bg-white/90 p-4 shadow-lg shadow-sky-100 backdrop-blur sm:p-6">
        {/* Mobile: side scroll | Tablet: 5 columns | Desktop: 10 columns */}
        <ul className="flex snap-x gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 sm:gap-x-2 sm:gap-y-6 sm:overflow-visible sm:pb-0 lg:grid-cols-10">
          {categories.map((c) => (
            <li key={c.name} className="shrink-0 snap-start sm:shrink">
              <a
                href={`#${c.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group flex w-24 flex-col items-center text-center focus:outline-none sm:w-auto"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl transition group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-sky-500 ${c.bg}`}
                >
                  {c.icon}
                </span>
                <span className="mt-2 text-sm font-semibold text-slate-800">{c.name}</span>
                <span className="text-xs text-slate-500">{c.sub}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- WHY CHOOSE US ---------- */
function WhyChoose() {
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[2fr_3fr] lg:gap-12">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
            💜 Why choose Eventora?
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            Making Every Moment Special &amp; Effortless
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            From intimate gatherings to grand celebrations, Eventora brings together the best venues,
            trusted vendors and curated packages, so you can focus on what truly matters: making memories.
          </p>
          <a
            href="#events"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            Explore more
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-100"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-full text-xl ${f.bg}`}>
                {f.icon}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1 text-xs leading-snug text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const browseCategories = [
  { name: "Weddings", count: "12K+ Events", icon: "💍", grad: "from-rose-100 to-amber-100" },
  { name: "Birthdays", count: "8K+ Events", icon: "🎂", grad: "from-pink-100 to-fuchsia-100" },
  { name: "Corporate", count: "5K+ Events", icon: "💼", grad: "from-sky-100 to-blue-200" },
  { name: "Engagement", count: "4K+ Events", icon: "💞", grad: "from-rose-100 to-pink-200" },
  { name: "Festivals", count: "3K+ Events", icon: "🪔", grad: "from-orange-100 to-amber-200" },
  { name: "Exhibitions", count: "2K+ Events", icon: "🏛️", grad: "from-cyan-100 to-sky-200" },
  { name: "Parties", count: "6K+ Events", icon: "🎉", grad: "from-violet-100 to-pink-200" },
  { name: "More", count: "Explore More", icon: "🔳", grad: "from-slate-100 to-sky-100", noHeart: true },
];

const vendors = [
  { name: "Royal Caterers", rating: "4.8", reviews: "1.2k", icon: "🍽️", grad: "from-amber-200 to-orange-300" },
  { name: "Dream Decor", rating: "4.7", reviews: "980", icon: "💐", grad: "from-pink-200 to-rose-300" },
  { name: "Shutter Stories", rating: "4.9", reviews: "2.1k", icon: "📸", grad: "from-sky-200 to-cyan-300" },
  { name: "The Grand Band", rating: "4.8", reviews: "750", icon: "🎸", grad: "from-violet-200 to-fuchsia-300" },
];

/* ---------- Scroll reveal animation (screen mein aate hi fade + slide up) ---------- */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Heart (favourite) button ---------- */
function HeartButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setLiked((v) => !v);
      }}
      aria-label={liked ? "Remove from favourites" : "Add to favourites"}
      aria-pressed={liked}
      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
    >
      <svg
        className={`h-4 w-4 transition-all duration-200 ${liked ? "scale-110 fill-rose-500 text-rose-500" : "fill-none text-slate-500"}`}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}

/* ---------- BROWSE BY CATEGORY ---------- */
function BrowseByCategory() {
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex items-end justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-xl">🗂️</span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Browse by Category</h2>
              <p className="text-sm text-slate-500">Find events for every occasion</p>
            </div>
          </div>
          <a href="#categories" className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-sky-700 hover:text-sky-900">
            <span className="hidden sm:inline">View All Categories</span>
            <span className="sm:hidden">View all</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
          {browseCategories.map((c, i) => (
            <Reveal key={c.name} delay={i * 60}>
              <a
                href={`#${c.name.toLowerCase()}`}
                className="group relative block overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sky-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                {!c.noHeart && <HeartButton />}
                <div className={`flex h-24 items-center justify-center bg-gradient-to-br text-5xl ${c.grad}`}>
                  <span className="transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">{c.icon}</span>
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.count}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- TOP VENDORS ---------- */
function TopVendors() {
  return (
    <section className="px-4 pb-14">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-sky-900 via-sky-800 to-blue-900 p-5 shadow-xl shadow-sky-900/20 sm:p-8">
          {/* glow decorations */}
          <div aria-hidden="true" className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 right-10 h-56 w-56 rounded-full bg-pink-400/20 blur-3xl" />

          <div className="relative grid items-center gap-6 lg:grid-cols-[2fr_5fr] lg:gap-8">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-sky-100 ring-1 ring-white/20">
                ✨ Trusted &amp; Trending
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Top Vendors</h2>
              <p className="mt-2 text-sm text-sky-100/80">Find the best vendors for your event, all in one place.</p>
              <a
                href="#vendors"
                className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-sky-800 transition hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-900"
              >
                Browse All Vendors
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {vendors.map((v, i) => (
                <Reveal key={v.name} delay={150 + i * 100}>
                  <a
                    href="#vendors"
                    className="group relative block overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                  >
                    <HeartButton />
                    <div className={`flex h-24 items-center justify-center bg-gradient-to-br text-5xl sm:h-28 ${v.grad}`}>
                      <span className="transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-6">{v.icon}</span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-slate-900">{v.name}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <span className="text-amber-400">★</span>
                        <span className="font-semibold text-slate-700">{v.rating}</span>
                        <span>({v.reviews})</span>
                      </p>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleBtnRef = useRef(null);

  // Open hone par focus sidebar par, close hone par wapas button par
  useEffect(() => {
    if (open) {
      sidebarRef.current?.focus();
      document.body.style.overflow = "hidden"; // peeche ka scroll band
    } else {
      document.body.style.overflow = "";
      toggleBtnRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Esc dabane par close + Tab sidebar ke andar hi ghumega (focus trap)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && sidebarRef.current) {
        const items = sidebarRef.current.querySelectorAll("a, button");
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-30 border-b border-sky-100 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              ref={toggleBtnRef}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="sidebar"
              className="rounded-lg p-2 text-slate-700 hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <a href="#home" className="flex items-center">
              <img
                src="/Even_handler_Logo.png"
                alt="Eventora logo"
                className="h-12 w-auto object-contain"
              />
            </a>
          </div>

          {/* Right side: notification bell + user icon */}
          <div className="flex items-center gap-1">
            <button
              aria-label="Notifications"
              className="relative rounded-full p-2 text-slate-600 hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              {/* Unread dot: hatana ho to is span ko delete kar dein */}
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            <button
              aria-label="User profile"
              className="rounded-full p-2 text-slate-600 hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* SIDEBAR */}
      <aside
        id="sidebar"
        ref={sidebarRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Sidebar menu"
        // inert: close hone par andar ke links tab se bhi focus nahi honge
        {...(!open && { inert: "" })}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85%] flex-col bg-white shadow-xl outline-none transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <img
            src="/Even_handler_Logo.png"
            alt="Eventora logo"
            className="h-12 w-auto object-contain"
          />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <ul className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 focus:bg-sky-50 focus:text-sky-700 focus:outline-none"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="border-t border-slate-200 p-4">
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="block rounded-lg bg-sky-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-sky-700"
          >
            Get started
          </a>
        </div>
      </aside>

      {/* PAGE CONTENT */}
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-white pt-16">
        {/* Soft party-style decorations (sirf design ke liye) */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-cyan-200/50 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 top-72 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-10 left-1/3 h-52 w-52 rounded-full bg-pink-200/40 blur-3xl" />
        <Hero />
        <div className="relative">
          <EventCategories />
          <WhyChoose />
          <BrowseByCategory />
          <TopVendors />
        </div>
      </main>
    </>
  );
}