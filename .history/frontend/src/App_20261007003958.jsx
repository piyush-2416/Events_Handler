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
        src="/Project_main_Image.png"
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
                  <img className=" transition-transform duration-500" src={c.image}></img>
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

/* =====================================================================
   NEW: EXCLUSIVE OFFERS + TESTIMONIALS
   (alag file nahi banayi, sab yahin App.jsx mein hai)
   ===================================================================== */

/* Offers ka data: yahan se offers badal sakte ho (code = coupon code) */
const offers = [
  { title: "Dream Wedding Bundle", desc: "Venue + decor + photography in one package", off: "25%", label: "OFF", code: "WED25", icon: "💍", grad: "from-rose-400 to-pink-500" },
  { title: "Birthday Bash", desc: "Cake, decor and entertainment combo deals", off: "15%", label: "OFF", code: "BDAY15", icon: "🎂", grad: "from-fuchsia-400 to-purple-500" },
  { title: "Corporate Events", desc: "Conferences, team outings and annual days", off: "₹5K", label: "FLAT OFF", code: "CORP5K", icon: "💼", grad: "from-sky-500 to-blue-600" },
  { title: "First Booking Treat", desc: "New to Eventora? Your first event is on us", off: "10%", label: "OFF", code: "WELCOME10", icon: "🎉", grad: "from-amber-400 to-orange-500" },
];

/* Offers kab tak chalenge (countdown isi date tak chalega) */
const OFFER_END = new Date("2026-10-31T23:59:59");

/* Testimonials ka data */
const testimonials = [
  {
    name: "Priya Sharma",
    type: "Wedding",
    text: "Eventora made our wedding absolutely magical! Everything was perfect, from the venue to the decor. Highly recommended!",
    grad: "from-rose-300 to-pink-400",
  },
  {
    name: "Rahul Mehta",
    type: "Corporate",
    text: "We hosted our annual company event through Eventora and it was a seamless experience. The team is highly professional!",
    grad: "from-sky-300 to-blue-400",
  },
  {
    name: "Neha Verma",
    type: "Birthday",
    text: "The platform is so easy to use and the vendors are amazing. Our birthday party was a huge success!",
    grad: "from-amber-300 to-orange-400",
  },
  {
    name: "Amit Singh",
    type: "Anniversary",
    text: "Found a great caterer and decorator within minutes. Booking was simple and the support team was always there to help.",
    grad: "from-violet-300 to-fuchsia-400",
  },
  {
    name: "Sneha Kapoor",
    type: "Engagement",
    text: "Our engagement function turned out beautiful. The curated packages saved us so much time and stress.",
    grad: "from-teal-300 to-cyan-400",
  },
];

/* ---------- Countdown hook: har second update hota hai ---------- */
function useCountdown(target) {
  const calc = () => Math.max(0, target.getTime() - Date.now());
  const [ms, setMs] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setMs(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const s = Math.floor(ms / 1000);
  return {
    Days: Math.floor(s / 86400),
    Hrs: Math.floor((s % 86400) / 3600),
    Min: Math.floor((s % 3600) / 60),
    Sec: s % 60,
  };
}

/* ---------- Coupon copy button (click par "Copied" animation) ---------- */
function CopyCode({ code }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard block ho to bhi animation dikha dete hain */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={copy}
      aria-label={`Copy coupon code ${code}`}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 active:scale-95 ${
        copied ? "scale-105 bg-emerald-500" : "bg-sky-600 hover:bg-sky-700"
      }`}
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

/* ---------- EXCLUSIVE OFFERS (coupon-ticket style + live countdown) ---------- */
function ExclusiveOffers() {
  const t = useCountdown(OFFER_END);

  return (
    <section className="px-4 pb-10 sm:pb-14">
      <div className="mx-auto max-w-6xl">
        {/* Heading row + countdown */}
        <Reveal className="flex lg:flex-row flex-col justify-between lg:items-end gap-5">
          <div className="flex items-start gap-3">
            <span className="flex justify-center items-center bg-amber-100 rounded-xl w-10 h-10 text-xl animate-bounce motion-reduce:animate-none">
              🎁
            </span>
            <div>
              <h2 className="font-bold text-slate-900 text-xl sm:text-2xl">Exclusive Offers</h2>
              <p className="text-slate-500 text-sm">Limited-time deals on your favourite events. Grab them before they&apos;re gone!</p>
            </div>
          </div>

          {/* Countdown boxes */}
          <div className="flex items-center gap-2" role="timer" aria-label="Offer ends in">
            <span className="mr-1 font-medium text-slate-500 text-xs">Ends in</span>
            {Object.entries(t).map(([unit, val]) => (
              <div
                key={unit}
                className="bg-gradient-to-br from-sky-800 to-blue-900 shadow-md shadow-sky-900/20 px-2 py-1.5 rounded-xl min-w-[3.25rem] text-white text-center"
              >
                <span className="block font-bold tabular-nums text-lg leading-none">{String(val).padStart(2, "0")}</span>
                <span className="text-[10px] text-sky-200 uppercase tracking-wide">{unit}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Ticket cards: mobile 1 | desktop 2 */}
        <div className="gap-4 grid grid-cols-1 lg:grid-cols-2 mt-6">
          {offers.map((o, i) => (
            <Reveal key={o.code} delay={i * 100}>
              <article className="group relative flex bg-white shadow-sm hover:shadow-sky-200/60 hover:shadow-xl border border-sky-100 rounded-2xl overflow-hidden transition hover:-translate-y-1.5 duration-300">
                {/* Left stub: discount */}
                <div className={`relative flex w-28 shrink-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-br p-3 text-white sm:w-36 ${o.grad}`}>
                  <span className="-top-4 -right-4 absolute bg-white/15 rounded-full w-16 h-16 group-hover:scale-150 transition-transform duration-500" />
                  <span className="relative text-3xl group-hover:-rotate-12 group-hover:scale-125 transition-transform duration-500">{o.icon}</span>
                  <span className="relative mt-1 font-extrabold text-2xl sm:text-3xl leading-none">{o.off}</span>
                  <span className="relative mt-1 font-semibold text-[10px] tracking-widest">{o.label}</span>
                </div>

                {/* Right side: details + code */}
                <div className="relative flex flex-col flex-1 justify-between gap-3 p-4 border-sky-200 border-l-2 border-dashed">
                  {/* Ticket notch (kate hue circle) */}
                  <span aria-hidden="true" className="-top-2.5 -left-2.5 absolute bg-sky-50 border border-sky-100 rounded-full w-5 h-5" />
                  <span aria-hidden="true" className="-bottom-2.5 -left-2.5 absolute bg-sky-50 border border-sky-100 rounded-full w-5 h-5" />

                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-sky-700 text-sm sm:text-base transition-colors">{o.title}</h3>
                    <p className="mt-1 text-slate-500 text-xs leading-snug">{o.desc}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-sky-50 px-3 py-1.5 border border-sky-300 border-dashed rounded-lg font-mono font-bold text-sky-800 text-xs tracking-wider">
                      {o.code}
                    </span>
                    <CopyCode code={o.code} />
                  </div>
                </div>

                {/* Hover par upar se neeche chamak */}
                <span
                  aria-hidden="true"
                  className="-left-1/3 group-hover:left-full absolute inset-y-0 bg-white/50 opacity-0 group-hover:opacity-100 w-1/4 -skew-x-12 transition-all duration-700 pointer-events-none"
                />
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-6 text-center">
          <a href="#offers" className="group inline-flex items-center gap-1 font-semibold text-sky-700 hover:text-sky-900 text-sm">
            View All Offers
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Carousel arrow button (Testimonials ke liye) ---------- */
function ArrowButton({ dir, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "left" ? "Previous reviews" : "Next reviews"}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-sky-100 bg-white text-slate-700 shadow-md transition hover:scale-110 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${className}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={dir === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
      </svg>
    </button>
  );
}

/* ---------- TESTIMONIALS: Real Stories. Real Happiness. ---------- */
function Testimonials() {
  const trackRef = useRef(null);

  // Arrow click par card slide hota hai
  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className="bg-gradient-to-b from-transparent via-sky-100/60 to-sky-50 px-4 py-12 sm:py-16">
      <div className="items-center gap-8 lg:gap-10 grid lg:grid-cols-[2fr_5fr] mx-auto max-w-6xl">
        {/* Left: heading + button */}
        <Reveal>
          <p className="inline-flex items-center gap-1.5 bg-sky-50 px-3 py-1 rounded-full ring-1 ring-sky-100 font-medium text-sky-700 text-xs">
            💬 What Our Users Say
          </p>
          <h2 className="mt-4 font-bold text-slate-900 text-3xl sm:text-4xl leading-tight">Real Stories. Real Happiness.</h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Hear from our amazing customers who made their special moments unforgettable with Eventora.
          </p>
          <a
            href="#community"
            className="group inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 mt-6 px-5 py-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 font-semibold text-white text-sm"
          >
            Join Our Community
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>

        {/* Right: scrollable review cards */}
        <Reveal delay={150} className="relative min-w-0">
          {/* Desktop/tablet arrows (side) */}
          <ArrowButton dir="left" onClick={() => scroll(-1)} className="hidden top-1/2 -left-3 z-10 absolute sm:flex -translate-y-1/2" />
          <ArrowButton dir="right" onClick={() => scroll(1)} className="hidden top-1/2 -right-3 z-10 absolute sm:flex -translate-y-1/2" />

          <div
            ref={trackRef}
            className="[&::-webkit-scrollbar]:hidden flex gap-4 pb-3 overflow-x-auto scroll-smooth snap-mandatory snap-x [scrollbar-width:none]"
          >
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="group relative bg-white shadow-sm hover:shadow-sky-200/60 hover:shadow-xl p-5 border border-sky-100 rounded-2xl w-[85%] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] overflow-hidden transition hover:-translate-y-1 duration-300 snap-start shrink-0"
              >
                {/* Bada quote mark (decoration), hover par thoda hilta hai */}
                <span
                  aria-hidden="true"
                  className="top-0 right-3 absolute font-serif text-sky-100 text-6xl group-hover:-rotate-6 group-hover:scale-125 transition-transform duration-500 pointer-events-none select-none"
                >
                  ”
                </span>

                <figcaption className="relative flex items-center gap-3">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white transition-transform duration-300 group-hover:scale-110 ${t.grad}`}
                    aria-hidden="true"
                  >
                    {t.name.split(" ").map((w) => w[0]).join("")}
                  </span>
                  <span>
                    <span className="block font-semibold text-slate-900 text-sm">{t.name}</span>
                    <span className="block text-slate-500 text-xs">{t.type}</span>
                  </span>
                </figcaption>
                <p className="relative mt-3 text-amber-400" aria-label="5 out of 5 stars">★★★★★</p>
                <blockquote className="relative mt-2 text-slate-600 text-sm leading-relaxed">“{t.text}”</blockquote>
              </figure>
            ))}
          </div>

          {/* Mobile arrows (neeche) */}
          <div className="sm:hidden flex justify-center gap-3 mt-2">
            <ArrowButton dir="left" onClick={() => scroll(-1)} />
            <ArrowButton dir="right" onClick={() => scroll(1)} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =====================================================================
   NEW: AI CHATBOT (floating button + chat window)
   Abhi sirf UI hai. Backend jodne ke liye neeche getBotReply() badalna hai.
   ===================================================================== */

/* Quick suggestion buttons (pehli baar chat khulne par dikhte hain) */
const quickReplies = ["Plan a wedding 💍", "Birthday party ideas 🎂", "Show me offers 🎁", "Find vendors 📸"];

/* ---------- BOT REPLY ----------
   ABHI: demo ke liye fake reply deta hai (keyword matching).
   BAAD MEIN: is poore function ko apne backend call se replace karo:

   async function getBotReply(messages) {
     const res = await fetch("http://localhost:5000/api/chat", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ messages }), // [{ role, content }]
     });
     if (!res.ok) throw new Error("Request failed");
     const data = await res.json();
     return data.reply;
   }
*/
async function getBotReply(messages) {
  await new Promise((r) => setTimeout(r, 1200)); // typing ka feel
  const last = messages[messages.length - 1].content.toLowerCase();
  if (last.includes("wedding")) return "Congratulations! 💍 Use code WED25 for 25% off our wedding bundles. What's your guest count?";
  if (last.includes("birthday")) return "Fun! 🎂 Code BDAY15 gives 15% off birthday combos. Who is the party for?";
  if (last.includes("offer")) return "Active offers: WED25, BDAY15, CORP5K and WELCOME10. Scroll to Exclusive Offers to copy a code!";
  if (last.includes("vendor")) return "We have verified caterers, decorators, photographers and bands. What kind of event are you planning?";
  return "I can help with weddings, birthdays, corporate events and more. Tell me what you're planning!";
}

/* ---------- Typing dots (bot soch raha hai) ---------- */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 bg-white shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm ring-1 ring-sky-100 w-fit" aria-label="Assistant is typing">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          style={{ animationDelay: `${d}ms` }}
          className="bg-sky-400 rounded-full w-2 h-2 animate-bounce motion-reduce:animate-none"
        />
      ))}
    </div>
  );
}

/* ---------- CHATBOT ---------- */
function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! 👋 I'm Eventora's assistant. What event are we planning today?" },
  ]);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Naya message aane par neeche tak scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  // Chat khulne par input par focus + Esc se close
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async (text) => {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const reply = await getBotReply(next);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const showQuick = messages.length === 1; // sirf shuru mein

  return (
    <>
      {/* CHAT WINDOW */}
      <section
        aria-label="Eventora assistant chat"
        {...(!open && { inert: "" })}
        className={`fixed bottom-24 right-4 z-30 flex h-[28rem] max-h-[calc(100vh-7rem)] w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-2xl shadow-sky-900/20 transition-all duration-300 sm:right-6 sm:w-96 ${
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-90 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-sky-700 to-blue-800 px-4 py-3 text-white">
          <span className="relative flex justify-center items-center bg-white/20 rounded-full w-10 h-10 text-xl">
            🤖
            <span className="right-0 bottom-0 absolute bg-emerald-400 rounded-full ring-2 ring-sky-700 w-2.5 h-2.5" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-sm leading-tight">Eventora Assistant</p>
            <p className="text-sky-100 text-xs">Online · Ask me anything</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="hover:bg-white/15 p-1.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 bg-gradient-to-b from-sky-50 to-white p-4 overflow-y-auto" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <p
                className={`max-w-[80%] whitespace-pre-wrap px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-2xl rounded-br-sm bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-md shadow-sky-300/40"
                    : "rounded-2xl rounded-bl-sm bg-white text-slate-700 shadow-sm ring-1 ring-sky-100"
                }`}
              >
                {m.content}
              </p>
            </div>
          ))}

          {showQuick && (
            <div className="flex flex-wrap gap-2 pt-1">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="bg-white hover:bg-sky-50 hover:shadow-md px-3 py-1.5 border border-sky-200 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 font-medium text-sky-700 text-xs transition hover:-translate-y-0.5"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {loading && <TypingDots />}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 bg-white p-3 border-sky-100 border-t">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Type your message..."
            maxLength={500}
            aria-label="Type your message"
            className="flex-1 bg-sky-50 px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800 placeholder:text-slate-400 text-sm"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="flex justify-center items-center bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 w-10 h-10 text-white hover:scale-105 disabled:hover:scale-100 transition disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </section>

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        className="group right-4 sm:right-6 bottom-5 z-30 fixed flex justify-center items-center bg-gradient-to-br from-sky-500 to-blue-700 shadow-sky-500/40 shadow-xl rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 w-14 h-14 text-white hover:scale-110 transition"
      >
        {/* Pulse ring: sirf chat band ho tab */}
        {!open && (
          <span aria-hidden="true" className="absolute inset-0 bg-sky-400/50 rounded-full animate-ping motion-reduce:animate-none" />
        )}
        <span className={`relative text-2xl transition-transform duration-300 ${open ? "rotate-90" : "group-hover:-rotate-12"}`}>
          {open ? "✕" : "💬"}
        </span>
      </button>
    </>
  );
}

/* =====================================================================
   NEW: FOOTER (CTA card + 4 columns + bottom bar)
   ===================================================================== */

/* Social links: href mein apne asli profile links daal dena */
const svgProps = { className: "h-5 w-5", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" };
const socials = [
  {
    name: "Instagram",
    href: "https://instagram.com/",
    icon: (
      <svg {...svgProps}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com/",
    icon: (
      <svg {...svgProps}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/",
    icon: (
      <svg {...svgProps}>
        <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/",
    icon: (
      <svg {...svgProps}>
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/",
    icon: (
      <svg {...svgProps}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/",
    icon: (
      <svg {...svgProps}>
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
      </svg>
    ),
  },
];

/* ---------- FOOTER ---------- */
function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: yahan apni newsletter API call jodni hai
    setSubscribed(true);
    setEmail("");
  };

  const linkClass =
    "inline-block text-sm text-sky-100/75 transition hover:translate-x-1 hover:text-white focus:outline-none focus-visible:text-white focus-visible:underline";
  const headingClass = "text-xs font-semibold uppercase tracking-widest text-sky-200";

  return (
    <footer className="relative pt-10">
      {/* CTA card: upar se footer par thoda overlap karta hai */}
      

      {/* Dark footer body */}
      <div className="relative bg-gradient-to-br from-sky-900 via-sky-800 to-blue-900 rounded-t-[2.5rem] overflow-hidden text-white">
        {/* glow decorations (TopVendors jaisi) */}
        <div aria-hidden="true" className="top-10 -left-16 absolute bg-cyan-400/15 blur-3xl rounded-full w-56 h-56 pointer-events-none" />
        <div aria-hidden="true" className="right-10 -bottom-20 absolute bg-pink-400/15 blur-3xl rounded-full w-64 h-64 pointer-events-none" />

        <div className="relative mx-auto px-4 pt-28 pb-6 max-w-6xl">
          <div className="gap-10 grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.6fr]">
            {/* Brand + newsletter */}
            <div>
              {/* Logo white card mein, taaki dark background par saaf dikhe */}
              <a href="#home" className="inline-flex items-center bg-white shadow-md px-3 py-1.5 rounded-xl">
                <img src="/Even_handler_Logo.png" alt="Eventora logo" className="w-auto h-12 object-contain" />
              </a>
              <p className="mt-4 max-w-xs text-sky-100/75 text-sm leading-relaxed">
                Plan weddings, birthdays, corporate events and more with verified vendors, all in one place.
              </p>

              <form onSubmit={subscribe} className="mt-6 max-w-sm">
                <label htmlFor="footer-email" className="font-medium text-sky-100/80 text-xs">
                  Get event tips &amp; offers in your inbox
                </label>
                <div className="flex gap-2 mt-2">
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setSubscribed(false); }}
                    placeholder="Your email"
                    required
                    className="flex-1 bg-white/10 px-3 py-2 rounded-lg focus:outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white min-w-0 text-white placeholder:text-sky-200/60 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-white hover:bg-sky-50 px-4 py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-900 font-semibold text-sky-800 text-sm transition"
                  >
                    Join
                  </button>
                </div>
                {subscribed && <p className="mt-2 text-emerald-300 text-xs" role="status">Thanks for subscribing! 🎉</p>}
              </form>
            </div>

            {/* Quick links (navbar ke links hi reuse hue hain) */}
            <nav aria-label="Quick links">
              <h3 className={headingClass}>Quick Links</h3>
              <ul className="space-y-2.5 mt-4">
                {links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className={linkClass}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Events (categories ke pehle 6 naam) */}
            <nav aria-label="Event types">
              <h3 className={headingClass}>Events</h3>
              <ul className="space-y-2.5 mt-4">
                {categories.slice(0, 6).map((c) => (
                  <li key={c.name}>
                    <a href={`#${c.name.toLowerCase().replace(/\s+/g, "-")}`} className={linkClass}>{c.name}</a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact + social */}
            <div>
              <h3 className={headingClass}>Get in Touch</h3>
              {/* Neeche ki details apni asli details se badal dena */}
              <ul className="space-y-3 mt-4 text-sky-100/80 text-sm">
                <li className="flex items-center gap-3">
                  <span aria-hidden="true" className="flex justify-center items-center bg-white/10 rounded-full w-8 h-8 text-sm">📧</span>
                  <a href="mailto:hello@eventora.com" className="hover:text-white hover:underline">hello@eventora.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <span aria-hidden="true" className="flex justify-center items-center bg-white/10 rounded-full w-8 h-8 text-sm">📞</span>
                  <a href="tel:+910000000000" className="hover:text-white hover:underline">+91 00000 00000</a>
                </li>
                <li className="flex items-center gap-3">
                  <span aria-hidden="true" className="flex justify-center items-center bg-white/10 rounded-full w-8 h-8 text-sm">📍</span>
                  <span>Your City, India</span>
                </li>
              </ul>

              <h3 className={`${headingClass} mt-6`}>Follow Us</h3>
              <ul className="flex flex-wrap gap-2 mt-3">
                {socials.map((so) => (
                  <li key={so.name}>
                    <a
                      href={so.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={so.name}
                      className="flex justify-center items-center bg-white/10 hover:bg-white rounded-full focus:outline-none ring-1 ring-white/20 focus-visible:ring-2 focus-visible:ring-white w-9 h-9 hover:text-sky-800 transition hover:-translate-y-1 duration-300"
                    >
                      {so.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex sm:flex-row flex-col justify-between items-center gap-3 mt-10 pt-5 border-white/15 border-t text-sky-100/70 text-xs">
            <p>© {new Date().getFullYear()} Eventora. All rights reserved.</p>
            <ul className="flex items-center gap-4">
              <li><a href="#privacy" className="hover:text-white hover:underline">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white hover:underline">Terms of Service</a></li>
              <li><a href="#home" className="hover:text-white hover:underline">Back to top ↑</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
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
          {/* NEW: end mein add kiye gaye sections */}
          <ExclusiveOffers />
          <Testimonials />
        </div>
      </main>

      {/* NEW: Footer */}
      <Footer />

      {/* NEW: AI chatbot (floating button) */}
      <ChatBot />
    </>
  );
}