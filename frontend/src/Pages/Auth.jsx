import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomePath } from "../utils/roles";

/* ---------- apne routes ke hisaab se yahan badal sakte ho ---------- */
const LOGIN_PATH = "/login";
const SIGNUP_PATH = "/signup";
const PROFILE_PATH = "/profile";
const LOGO_SRC = "/Even_handler_Logo.png"; // Navbar wala hi logo
const FOOTER_LINKS = [
  ["Home", "/"],
  ["Features", "#features"],
  ["About", "/about"],
  ["Contact", "/contact"],
];
const HERO_IMAGE =
  "https://wittysparks.com/wp-content/uploads/2018/09/Business-event-gala.jpg";

/* ---------- inline icons ---------- */
const Icon = ({ d, className = "w-5 h-5", strokeWidth = 1.7 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);
const ICONS = {
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 118 0v3",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0",
  userPlus:
    "M10 12a4 4 0 100-8 4 4 0 000 8zM2.5 21a7.5 7.5 0 0115 0M19 8v6M16 11h6",
  home: "M3 11l9-8 9 8M5 9.5V21h14V9.5M10 21v-6h4v6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  sparkle:
    "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16z",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
  users:
    "M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 6.5M18 14a6.5 6.5 0 013.5 6",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM8.5 12.5l2.5 2.5 4.5-5",
  envelope: "M4 9l8-5 8 5v10H4V9zM4 9l8 6 8-6",
  coins:
    "M12 8c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3zM4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  leaf: "M11 20A7 7 0 019.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10zM2 21c0-3 1.9-5.5 6-7",
  calculator:
    "M6 3h12v18H6zM9 7h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01",
  store:
    "M4 9l1-5h14l1 5M4 9v11h16V9M4 9a2.5 2.5 0 005 0 2.5 2.5 0 006 0 2.5 2.5 0 005 0M10 20v-5h4v5",
  pin: "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z",
  box: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01",
  arrow: "M5 12h14M13 6l6 6-6 6",
  instagram:
    "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zM12 16a4 4 0 100-8 4 4 0 000 8zM17.5 6.5h.01",
  facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
  twitter:
    "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
  linkedin:
    "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z",
};

/* ---------- content ---------- */
const HERO_POINTS = [
  { icon: ICONS.bolt, lines: ["Smart", "Planning"] },
  { icon: ICONS.users, lines: ["Easy", "Collaboration"] },
  { icon: ICONS.shield, lines: ["Stress Free", "Events"] },
];

// Welcome card ke neeche chhote benefit chips
const CARD_PERKS = ["Free account", "AI planning tools", "Customer & Vendor"];

// Logged-in user ke liye: role ke hisaab se pehle button ka label
const HOME_LABEL = {
  user: { title: "Go to Home", desc: "Events, vendors aur venues explore karo" },
  vendor: { title: "Go to Dashboard", desc: "Apni bookings aur services dekho" },
  admin: { title: "Go to Admin Panel", desc: "Users aur app manage karo" },
};

const AI_FEATURES = [
  { icon: ICONS.sparkle, title: "AI Problem Solver", text: "Get instant solutions to your event-related doubts and challenges.", tile: "bg-indigo-100 text-indigo-600" },
  { icon: ICONS.envelope, title: "AI Invitation Creator", text: "Design beautiful, customized invitations in seconds.", tile: "bg-teal-100 text-teal-600" },
  { icon: ICONS.coins, title: "AI Budget Planner", text: "Plan your budget smartly with AI recommendations.", tile: "bg-amber-100 text-amber-600" },
  { icon: ICONS.shield, title: "Risk & Backup Planner", text: "Be prepared for unexpected situations with AI insights.", tile: "bg-emerald-100 text-emerald-600" },
  { icon: ICONS.leaf, title: "Sustainable Planner", text: "Make your event eco-friendly with smart suggestions.", tile: "bg-green-100 text-green-600" },
];

const MORE_FEATURES = [
  { icon: ICONS.users, title: "Guest List", text: "Manage your guest list, send invites and track RSVPs easily.", card: "from-emerald-50", tile: "bg-emerald-100 text-emerald-600" },
  { icon: ICONS.calculator, title: "Budget Planner", text: "Plan your budget, track expenses and stay on track.", card: "from-sky-50", tile: "bg-sky-100 text-sky-600" },
  { icon: ICONS.store, title: "Vendors", text: "Find and connect with trusted vendors for your event.", card: "from-violet-50", tile: "bg-violet-100 text-violet-600" },
  { icon: ICONS.pin, title: "Venues", text: "Explore the best venues for your special day.", card: "from-blue-50", tile: "bg-blue-100 text-blue-600" },
  { icon: ICONS.box, title: "Packages", text: "Choose from customizable packages for every occasion.", card: "from-orange-50", tile: "bg-orange-100 text-orange-500" },
  { icon: ICONS.calendar, title: "Event Management", text: "Organize, schedule and manage all your events in one place.", card: "from-rose-50", tile: "bg-rose-100 text-rose-500" },
  { icon: ICONS.envelope, title: "Invitations", text: "Create and share digital invitations with ease.", card: "from-indigo-50", tile: "bg-indigo-100 text-indigo-600" },
  { icon: ICONS.users, title: "Collaboration", text: "Work with your team, family and vendors in real-time.", card: "from-teal-50", tile: "bg-teal-100 text-teal-600" },
];

/* ---------- styles: halki entrance animation ---------- */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.au-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }

@keyframes au-zoom { from { transform: scale(1.08); } to { transform: scale(1); } }
@keyframes au-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

.au-img  { animation: au-zoom 1.6s cubic-bezier(.2,.7,.2,1) both; }
.au-in-1 { animation: au-rise .7s .1s  cubic-bezier(.2,.7,.2,1) both; }
.au-in-2 { animation: au-rise .7s .22s cubic-bezier(.2,.7,.2,1) both; }
.au-in-3 { animation: au-rise .7s .34s cubic-bezier(.2,.7,.2,1) both; }

@media (prefers-reduced-motion: reduce) {
  .au-img, .au-in-1, .au-in-2, .au-in-3 { animation: none; }
}
`;

/* ---------- chhote reusable parts ---------- */
const Pill = ({ children, icon, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide ${className}`}
  >
    {icon && <Icon d={icon} className="w-3.5 h-3.5" />}
    {children}
  </span>
);

export default function Auth() {
  const { user, loading } = useAuth();

  // Page sabko dikhta hai. Bas card ke buttons login state ke hisaab se badalte hain.
  const loggedIn = !loading && !!user;
  const firstName = user?.name?.split(" ")[0] || "";
  const homeInfo = HOME_LABEL[user?.role] || HOME_LABEL.user;

  return (
    <div className="bg-white min-h-screen text-slate-800 au-root">
      <style>{styles}</style>

      {/* ================= HERO + WELCOME CARD ================= */}
      <section className="relative bg-slate-900 overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Decorated wedding venue at sunset"
          onError={(e) => (e.target.style.display = "none")}
          className="absolute inset-0 w-full h-full object-cover au-img"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-slate-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

        <div className="relative items-center gap-10 grid lg:grid-cols-2 mx-auto px-4 sm:px-6 py-12 lg:py-14 max-w-7xl lg:min-h-[31rem]">
          {/* ---------- left: copy ---------- */}
          <div className="text-white">
            <div className="au-in-1">
              <Pill icon={ICONS.sparkle} className="bg-emerald-100/95 !font-medium text-emerald-900 !text-sm !tracking-normal">
                Your Perfect Event Starts Here
              </Pill>
            </div>

            <h1 className="mt-5 font-extrabold !text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight au-in-2">
              Plan Your Event
              <br />
              <span className="text-emerald-300">Smarter</span> with AI
            </h1>

            <p className="mt-6 max-w-md text-white/90 text-base leading-relaxed au-in-3">
              From intimate gatherings to grand celebrations, EventHandler helps you plan, organize and manage
              your events effortlessly — with the power of AI.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-4 mt-8 au-in-3">
              {HERO_POINTS.map((p) => (
                <div key={p.lines.join(" ")} className="flex items-center gap-3">
                  <Icon d={p.icon} className="w-7 h-7 text-white" strokeWidth={1.5} />
                  <p className="font-medium text-sm leading-tight">
                    {p.lines[0]}
                    <br />
                    {p.lines[1]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- right: Welcome card ---------- */}
          <div className="lg:justify-self-end w-full max-w-md au-in-2">
            <div className="bg-white shadow-2xl shadow-slate-950/40 rounded-3xl overflow-hidden">
              {/* Upar: gradient header + logo + welcome text */}
              <div className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 px-8 pt-8 pb-16 overflow-hidden text-white">
                {/* sajawat ke circles */}
                <span
                  aria-hidden="true"
                  className="-top-10 -right-10 absolute bg-white/10 rounded-full w-40 h-40 pointer-events-none"
                />
                <span
                  aria-hidden="true"
                  className="-bottom-12 left-10 absolute bg-emerald-300/20 rounded-full w-32 h-32 pointer-events-none"
                />

                <div className="relative">
                  <span className="inline-flex items-center bg-white shadow-md px-3 py-2 rounded-xl">
                    <img
                      src={LOGO_SRC}
                      alt="EventHandler logo"
                      onError={(e) => (e.target.style.display = "none")}
                      className="w-auto h-9 object-contain"
                    />
                  </span>

                  {loggedIn ? (
                    <>
                      <h2 className="mt-6 font-bold text-2xl sm:text-3xl leading-tight">
                        Welcome back,
                        <br />
                        <span className="break-words">{firstName} 👋</span>
                      </h2>
                      <p className="mt-3 max-w-xs text-emerald-50/90 text-sm leading-relaxed">
                        Aap login ho. Neeche se seedha apne page par jao.
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="mt-6 font-bold text-2xl sm:text-3xl leading-tight">
                        Welcome to
                        <br />
                        EventHandler
                      </h2>
                      <p className="mt-3 max-w-xs text-emerald-50/90 text-sm leading-relaxed">
                        Apna account kholo ya naya banao aur apna event plan karna shuru karo.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Neeche: action card (header ke upar thoda overlap karta hai) */}
              <div className="relative -mt-8 px-5 sm:px-7 pb-8">
                <div className="space-y-3 bg-white shadow-slate-900/10 shadow-xl p-3 rounded-2xl ring-1 ring-slate-100">
                  {loggedIn ? (
                    <>
                      {/* Logged in: Home / Dashboard row */}
                      <Link
                        to={getHomePath(user.role)}
                        className="group flex items-center gap-4 bg-emerald-700 hover:bg-emerald-800 shadow-emerald-900/20 shadow-md px-4 py-4 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 text-white transition-colors"
                      >
                        <span className="flex flex-shrink-0 justify-center items-center bg-white/15 rounded-lg w-12 h-12">
                          <Icon d={ICONS.home} className="w-6 h-6" />
                        </span>
                        <span className="flex-1 min-w-0 text-left">
                          <span className="block font-semibold text-base">{homeInfo.title}</span>
                          <span className="block mt-0.5 text-emerald-100 text-xs">{homeInfo.desc}</span>
                        </span>
                        <Icon
                          d={ICONS.arrow}
                          className="flex-shrink-0 w-5 h-5 transition-transform group-hover:translate-x-1"
                        />
                      </Link>

                      {/* Logged in: Profile row */}
                      <Link
                        to={PROFILE_PATH}
                        className="group flex items-center gap-4 bg-white hover:bg-emerald-50 px-4 py-4 border-2 border-emerald-700 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 text-emerald-900 transition-colors"
                      >
                        <span className="flex flex-shrink-0 justify-center items-center bg-emerald-100 rounded-lg w-12 h-12 text-emerald-700">
                          <Icon d={ICONS.user} className="w-6 h-6" />
                        </span>
                        <span className="flex-1 min-w-0 text-left">
                          <span className="block font-semibold text-base">My Profile</span>
                          <span className="block mt-0.5 text-slate-500 text-xs">
                            Apni details dekho ya logout karo
                          </span>
                        </span>
                        <Icon
                          d={ICONS.arrow}
                          className="flex-shrink-0 w-5 h-5 text-emerald-700 transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </>
                  ) : (
                    <>
                      {/* Guest: Login row */}
                      <Link
                        to={LOGIN_PATH}
                        className="group flex items-center gap-4 bg-emerald-700 hover:bg-emerald-800 shadow-emerald-900/20 shadow-md px-4 py-4 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 text-white transition-colors"
                      >
                        <span className="flex flex-shrink-0 justify-center items-center bg-white/15 rounded-lg w-12 h-12">
                          <Icon d={ICONS.lock} className="w-6 h-6" />
                        </span>
                        <span className="flex-1 min-w-0 text-left">
                          <span className="block font-semibold text-base">Login</span>
                          <span className="block mt-0.5 text-emerald-100 text-xs">
                            Apne account me wapas aao
                          </span>
                        </span>
                        <Icon
                          d={ICONS.arrow}
                          className="flex-shrink-0 w-5 h-5 transition-transform group-hover:translate-x-1"
                        />
                      </Link>

                      {/* Guest: Sign up row */}
                      <Link
                        to={SIGNUP_PATH}
                        className="group flex items-center gap-4 bg-white hover:bg-emerald-50 px-4 py-4 border-2 border-emerald-700 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 text-emerald-900 transition-colors"
                      >
                        <span className="flex flex-shrink-0 justify-center items-center bg-emerald-100 rounded-lg w-12 h-12 text-emerald-700">
                          <Icon d={ICONS.userPlus} className="w-6 h-6" />
                        </span>
                        <span className="flex-1 min-w-0 text-left">
                          <span className="block font-semibold text-base">Sign up</span>
                          <span className="block mt-0.5 text-slate-500 text-xs">
                            Naya account banao, bilkul free
                          </span>
                        </span>
                        <Icon
                          d={ICONS.arrow}
                          className="flex-shrink-0 w-5 h-5 text-emerald-700 transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </>
                  )}
                </div>

                {/* Benefit chips */}
                <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-6">
                  {CARD_PERKS.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-center gap-1.5 text-slate-500 text-xs"
                    >
                      <span className="flex justify-center items-center bg-emerald-100 rounded-full w-4 h-4 text-emerald-700">
                        <Icon d={ICONS.check} className="w-3 h-3" strokeWidth={2.4} />
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= AI POWERED FEATURES ================= */}
      <section id="features" className="bg-emerald-50/70 px-4 sm:px-6 py-16 scroll-mt-4">
        <div className="mx-auto max-w-7xl text-center">
          <Pill icon={ICONS.sparkle} className="bg-emerald-100 text-emerald-700 uppercase">
            AI Powered Features
          </Pill>
          <h2 className="mt-4 font-bold text-slate-900 text-3xl sm:text-4xl">
            Let AI Handle <span className="text-emerald-600">the Details</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Get smart suggestions, personalized plans and intelligent tools to make your event planning easier
            and better.
          </p>

          <div className="gap-x-6 gap-y-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-12">
            {AI_FEATURES.map((f) => (
              <div key={f.title} className="group flex flex-col items-center">
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-translate-y-1 ${f.tile}`}
                >
                  <Icon d={f.icon} className="w-8 h-8" strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 max-w-[13rem] text-slate-600 text-sm leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MORE POWERFUL FEATURES ================= */}
      <section className="px-4 sm:px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Pill className="bg-emerald-50 text-emerald-700 uppercase">Everything you need</Pill>
            <h2 className="mt-4 font-bold text-slate-900 text-3xl sm:text-4xl">More Powerful Features</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              From guest management to vendor coordination, everything you need to make your event perfect — in
              one place.
            </p>
          </div>

          <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-4 mt-10">
            {MORE_FEATURES.map((f) => (
              <div
                key={f.title}
                className={`rounded-xl bg-gradient-to-br ${f.card} to-white p-5 ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5`}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${f.tile}`}>
                  <Icon d={f.icon} className="w-5 h-5" />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-slate-500 text-sm leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="px-4 sm:px-6 pb-14">
        <div className="flex md:flex-row flex-col md:items-center gap-6 bg-gradient-to-r from-emerald-950 via-[#0b3b36] to-teal-900 mx-auto px-6 sm:px-10 py-8 rounded-2xl max-w-7xl text-white">
          <Icon d={ICONS.sparkle} className="flex-shrink-0 w-12 h-12 text-emerald-300" strokeWidth={1.4} />
          <div className="flex-1">
            <h2 className="font-bold text-xl sm:text-2xl">Ready to Plan Your Next Event?</h2>
            <p className="mt-1 max-w-xl text-white/80 text-sm">
              Join EventHandler today and turn your ideas into unforgettable moments with the help of AI.
            </p>
          </div>
          <Link
            to={loggedIn ? getHomePath(user.role) : SIGNUP_PATH}
            className="group inline-flex justify-center items-center gap-2 bg-emerald-300 hover:bg-emerald-200 px-6 py-3 rounded-lg font-semibold text-emerald-950 text-sm whitespace-nowrap transition-colors"
          >
            {loggedIn ? "Continue Planning" : "Get Started for Free"}
            <Icon d={ICONS.arrow} className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0a1f24] px-4 sm:px-6 py-8 text-white">
        <div className="items-center gap-6 grid md:grid-cols-3 mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <span className="flex justify-center items-center border border-emerald-400/60 rounded-lg w-10 h-10 text-emerald-300">
              <Icon d={ICONS.calendar} className="w-5 h-5" />
            </span>
            <div>
              <p className="font-bold leading-tight">EventHandler</p>
              <p className="text-white/50 text-xs">Plan • Organize • Celebrate</p>
            </div>
          </div>

          <nav className="flex flex-col items-center gap-3">
            <ul className="flex gap-6 text-white/80 text-xs">
              {FOOTER_LINKS.map(([label, to]) => (
                <li key={label}>
                  {to.startsWith("#") ? (
                    <a href={to} className="hover:text-emerald-300 transition-colors">
                      {label}
                    </a>
                  ) : (
                    <Link to={to} className="hover:text-emerald-300 transition-colors">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <span className="bg-white/10 w-56 h-px" />
          </nav>

          <div className="flex md:justify-end gap-3">
            {[
              ["Instagram", ICONS.instagram],
              ["Facebook", ICONS.facebook],
              ["Twitter", ICONS.twitter],
              ["LinkedIn", ICONS.linkedin],
            ].map(([label, d]) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex justify-center items-center bg-white/10 hover:bg-emerald-400 rounded-full w-8 h-8 text-white hover:text-emerald-950 transition-colors"
              >
                <Icon d={d} className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-6 pt-5 border-white/10 border-t max-w-7xl text-white/50 text-xs text-center">
          © {new Date().getFullYear()} EventHandler. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
