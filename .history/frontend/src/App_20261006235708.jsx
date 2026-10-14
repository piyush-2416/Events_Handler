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
        className="block shadow-lg shadow-sky-200/60 rounded-b-3xl sm:rounded-b-[2.5rem] w-full h-auto object-cover"
        fetchpriority="high"
      />
    </section>
  );
}

/* ---------- EVENT CATEGORIES ---------- */
function EventCategories() {
  return (
    <section className="z-10 relative -mt-5 sm:-mt-10 px-4 pb-6">
      <div className="bg-white/90 shadow-lg shadow-sky-100 backdrop-blur mx-auto p-4 sm:p-6 border border-sky-100 rounded-3xl max-w-6xl">
        {/* Mobile: side scroll | Tablet: 5 columns | Desktop: 10 columns */}
        <ul className="flex gap-4 sm:gap-x-2 sm:gap-y-6 sm:grid sm:grid-cols-5 lg:grid-cols-10 pb-2 sm:pb-0 sm:overflow-visible overflow-x-auto snap-x">
          {categories.map((c) => (
            <li key={c.name} className="snap-start shrink-0 sm:shrink">
              <a
                href={`#${c.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group flex flex-col items-center focus:outline-none w-24 sm:w-auto text-center"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl transition group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-sky-500 ${c.bg}`}
                >
                  {c.icon}
                </span>
                <span className="mt-2 font-semibold text-slate-800 text-sm">{c.name}</span>
                <span className="text-slate-500 text-xs">{c.sub}</span>
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
      <div className="items-center gap-8 lg:gap-12 grid lg:grid-cols-[2fr_3fr] mx-auto max-w-6xl">
        <div>
          <p className="inline-flex items-center gap-1.5 bg-sky-50 px-3 py-1 rounded-full font-medium text-sky-700 text-xs">
            💜 Why choose Eventora?
          </p>
          <h2 className="mt-4 font-bold text-slate-900 text-3xl sm:text-4xl leading-tight">
            Making Every Moment Special &amp; Effortless
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            From intimate gatherings to grand celebrations, Eventora brings together the best venues,
            trusted vendors and curated packages, so you can focus on what truly matters: making memories.
          </p>
          <a
            href="#events"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 mt-6 px-5 py-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 font-semibold text-white text-sm"
          >
            Explore more
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </a>
        </div>

        <div className="gap-3 sm:gap-4 grid grid-cols-2 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white/90 shadow-sm hover:shadow-lg hover:shadow-sky-100 p-4 border border-sky-100 rounded-2xl transition hover:-translate-y-0.5"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-full text-xl ${f.bg}`}>
                {f.icon}
              </span>
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">{f.title}</h3>
              <p className="mt-1 text-slate-500 text-xs leading-snug">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const browseCategories = [
  { name: "Weddings", count: "12K+ Events", image: "https://i.pinimg.com/originals/9b/8f/32/9b8f3275c79db1f3ff9f0ab974f55655.jpg", grad: "from-rose-100 to-amber-100" },
  { name: "Birthdays", count: "8K+ Events", image: "https://img.freepik.com/premium-photo/big-family-birthday-celebration-home-with-cake-lighting-candles-express-gratitude-happy-people-grandmother-parents-with-children-grandfather-party-growth-dessert-table_590464-414817.jpg", grad: "from-pink-100 to-fuchsia-100" },
  { name: "Corporate", count: "5K+ Events", image: "https://alcorprime.com/wp-content/uploads/2025/02/corporate-events-examples.jpg", grad: "from-sky-100 to-blue-200" },
  { name: "Engagement", count: "4K+ Events", image: "https://onefabday.com/wp-content/uploads/2018/10/The-Lodge-at-Ashford-wedding-by-Craig-and-Eva-Sanders-Photography-601.jpg?w=600", grad: "from-rose-100 to-pink-200" },
  { name: "Festivals", count: "3K+ Events", image: "https://media.istockphoto.com/photos/indian-family-celebrating-diwali-festival-with-fire-crackers-picture-id698710824?k=20&m=698710824&s=612x612&w=0&h=rmuV9NO-7D1ClGOksWR_CHvnibo4BJaOYw9QVpEQ6Tc=", grad: "from-orange-100 to-amber-200" },
  { name: "Exhibitions", count: "2K+ Events", image: "https://gregg.arts.ncsu.edu/wp-content/uploads/sites/78/2025/03/IMG_8269.jpg" },
  { name: "Parties", count: "6K+ Events", image: "https://img.freepik.com/premium-photo/corporate-event-icon-business-party-illustration-office-celebration-graphics-success-achievem_980716-51368.jpg?w=1060", grad: "from-violet-100 to-pink-200" },
  { name: "More", count: "Explore More", image: "https://img.freepik.com/premium-photo/cartoon-illustration-street-fair-festival-with-people-tents_36682-221255.jpg?w=2000", grad: "from-slate-100 to-sky-100", noHeart: true },
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
      className="top-2 right-2 z-10 absolute flex justify-center items-center bg-white/90 shadow rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 w-8 h-8 hover:scale-110 transition"
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
        <Reveal className="flex justify-between items-end gap-4">
          <div className="flex items-start gap-3">
            <span className="flex justify-center items-center bg-sky-100 rounded-xl w-10 h-10 text-xl">🗂️</span>
            <div>
              <h2 className="font-bold text-slate-900 text-xl sm:text-2xl">Browse by Category</h2>
              <p className="text-slate-500 text-sm">Find events for every occasion</p>
            </div>
          </div>
          <a href="#categories" className="group inline-flex items-center gap-1 font-semibold text-sky-700 hover:text-sky-900 text-sm shrink-0">
            <span className="hidden sm:inline">View All Categories</span>
            <span className="sm:hidden">View all</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>

        <div className="gap-3 sm:gap-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 mt-6">
          {browseCategories.map((c, i) => (
            <Reveal key={c.name} delay={i * 60}>
              <a
                href={`#${c.name.toLowerCase()}`}
                className="group block relative bg-white shadow-sm hover:shadow-sky-200/60 hover:shadow-xl border border-sky-100 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 overflow-hidden transition hover:-translate-y-1.5 duration-300"
              >
                {!c.noHeart && <HeartButton />}
                <div className={`flex h-24 items-center justify-center bg-gradient-to-br text-5xl ${c.grad}`}>
                  <img className="group-hover:rotate-6 group-hover:scale-125 transition-transform duration-500" src={c.image}></img>
                </div>
                <div className="p-3 text-center">
                  <p className="font-semibold text-slate-900 text-sm">{c.name}</p>
                  <p className="text-slate-500 text-xs">{c.count}</p>
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
        <div className="relative bg-gradient-to-br from-sky-900 via-sky-800 to-blue-900 shadow-sky-900/20 shadow-xl mx-auto p-5 sm:p-8 rounded-3xl max-w-6xl overflow-hidden">
          {/* glow decorations */}
          <div aria-hidden="true" className="-top-10 -left-10 absolute bg-cyan-400/20 blur-3xl rounded-full w-48 h-48 pointer-events-none" />
          <div aria-hidden="true" className="right-10 -bottom-12 absolute bg-pink-400/20 blur-3xl rounded-full w-56 h-56 pointer-events-none" />

          <div className="relative items-center gap-6 lg:gap-8 grid lg:grid-cols-[2fr_5fr]">
            <div>
              <p className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full ring-1 ring-white/20 font-medium text-sky-100 text-xs">
                ✨ Trusted &amp; Trending
              </p>
              <h2 className="mt-4 font-bold text-white text-3xl sm:text-4xl">Top Vendors</h2>
              <p className="mt-2 text-sky-100/80 text-sm">Find the best vendors for your event, all in one place.</p>
              <a
                href="#vendors"
                className="group inline-flex items-center gap-2 bg-white hover:bg-sky-50 mt-6 px-5 py-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-900 font-semibold text-sky-800 text-sm transition"
              >
                Browse All Vendors
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            <div className="gap-3 sm:gap-4 grid grid-cols-2 lg:grid-cols-4">
              {vendors.map((v, i) => (
                <Reveal key={v.name} delay={150 + i * 100}>
                  <a
                    href="#vendors"
                    className="group block relative bg-white shadow-md hover:shadow-2xl rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 overflow-hidden transition hover:-translate-y-1.5 duration-300"
                  >
                    <HeartButton />
                    <div className={`flex h-24 items-center justify-center bg-gradient-to-br text-5xl sm:h-28 ${v.grad}`}>
                      <span className="group-hover:-rotate-6 group-hover:scale-125 transition-transform duration-500">{v.icon}</span>
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-slate-900 text-sm">{v.name}</p>
                      <p className="flex items-center gap-1 mt-1 text-slate-500 text-xs">
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
      <header className="top-0 z-30 fixed inset-x-0 bg-white/90 backdrop-blur border-sky-100 border-b">
        <nav className="flex justify-between items-center mx-auto px-4 max-w-6xl h-16">
          <div className="flex items-center gap-3">
            <button
              ref={toggleBtnRef}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="sidebar"
              className="hover:bg-sky-100 p-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 text-slate-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <a href="#home" className="flex items-center">
              <img
                src="/Even_handler_Logo.png"
                alt="Eventora logo"
                className="w-auto h-12 object-contain"
              />
            </a>
          </div>

          {/* Right side: notification bell + user icon */}
          <div className="flex items-center gap-1">
            <button
              aria-label="Notifications"
              className="relative hover:bg-sky-100 p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              {/* Unread dot: hatana ho to is span ko delete kar dein */}
              <span className="top-2 right-2 absolute bg-rose-500 rounded-full ring-2 ring-white w-2.5 h-2.5" />
            </button>

            <button
              aria-label="User profile"
              className="hover:bg-sky-100 p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
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
        <div className="flex justify-between items-center px-4 border-slate-200 border-b h-16">
          <img
            src="/Even_handler_Logo.png"
            alt="Eventora logo"
            className="w-auto h-12 object-contain"
          />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="hover:bg-sky-100 p-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 text-slate-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <ul className="flex-1 space-y-1 p-3 overflow-y-auto">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block hover:bg-sky-50 focus:bg-sky-50 px-3 py-2.5 rounded-lg focus:outline-none font-medium text-slate-700 hover:text-sky-700 focus:text-sky-700 text-sm"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="p-4 border-slate-200 border-t">
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="block bg-sky-600 hover:bg-sky-700 py-2.5 rounded-lg font-semibold text-white text-sm text-center"
          >
            Get started
          </a>
        </div>
      </aside>

      {/* PAGE CONTENT */}
      <main className="relative bg-gradient-to-b from-sky-100 via-sky-50 to-white pt-16 min-h-screen overflow-hidden">
        {/* Soft party-style decorations (sirf design ke liye) */}
        <div aria-hidden="true" className="top-24 -left-16 absolute bg-cyan-200/50 blur-3xl rounded-full w-56 h-56 pointer-events-none" />
        <div aria-hidden="true" className="top-72 -right-16 absolute bg-amber-200/40 blur-3xl rounded-full w-64 h-64 pointer-events-none" />
        <div aria-hidden="true" className="bottom-10 left-1/3 absolute bg-pink-200/40 blur-3xl rounded-full w-52 h-52 pointer-events-none" />
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