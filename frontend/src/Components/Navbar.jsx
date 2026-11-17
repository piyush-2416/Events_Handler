import { useEffect, useRef, useState } from "react";
import { getLinksForRole } from "../data";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomePath } from "../utils/roles";

/* "🔍 Explore Events" -> icon "🔍" + text "Explore Events" (emoji na ho to 🏠 lagega) */
const splitLabel = (label) => {
  const m = label.match(/^(\p{Extended_Pictographic}\uFE0F?)\s*(.+)$/u);
  return m
    ? { icon: m[1], text: m[2].trim() }
    : { icon: "🏠", text: label.trim() };
};

/* NAVBAR + SIDEBAR (hamburger se sidebar khulta hai) */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleBtnRef = useRef(null);

  const { user } = useAuth();
  const { pathname } = useLocation();

  // Role ke hisaab se links (guest / user / vendor / admin)
  const allLinks = getLinksForRole(user?.role);

  // Logo click par role ke hisaab se home (vendor -> dashboard)
  const homePath = getHomePath(user?.role);

  // Band sidebar ke links Tab se focus na hon
  useEffect(() => {
    sidebarRef.current?.toggleAttribute("inert", !open);
  }, [open]);

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
              className="hover:bg-sky-100 p-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white-500 text-slate-700"
            >
              <img
                src="/Even_handler_Logo.png"
                alt="Eventora logo"
                className="w-auto h-12 object-contain"
              />
            </button>
          </div>

          {/* Right side: notification bell + profile / login */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              aria-label="Notifications"
              className="relative hover:bg-sky-100 p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 text-slate-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              {/* Unread dot: hatana ho to is span ko delete kar dein */}
              <span className="top-2 right-2 absolute bg-rose-500 rounded-full ring-2 ring-white w-2.5 h-2.5" />
            </button>

            {user ? (
              // Logged in: avatar circle, click karne par Profile page
              <Link
                to="/profile"
                aria-label="Open profile"
                className="flex items-center gap-3 hover:bg-sky-50 py-1 sm:pr-4 pl-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <span className="flex justify-center items-center bg-sky-600 rounded-full w-9 h-9 font-semibold text-white text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:flex flex-col leading-tight">
                  <span className="font-medium text-slate-700 text-sm">
                    {user.name}
                  </span>
                  <span className="text-sky-600 text-xs capitalize">
                    {user.role}
                  </span>
                </span>
              </Link>
            ) : (
              // Guest: sirf Login button
              <Link
                to="/login"
                className="bg-sky-600 hover:bg-sky-700 px-5 py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 font-medium text-white text-sm"
              >
                Login
              </Link>
            )}
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
        className={`fixed inset-y-0 left-0 z-50 flex w-60 max-w-[75%] flex-col overflow-hidden rounded-r-3xl bg-white shadow-2xl shadow-sky-900/30 outline-none transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top banner: logo + close + greeting (sab left aligned) */}
        <div className="relative bg-gradient-to-br from-sky-600 to-blue-700 px-4 pt-4 pb-4 overflow-hidden text-white text-left shrink-0">
          <span
            aria-hidden="true"
            className="-top-6 -right-6 absolute bg-white/10 rounded-full w-24 h-24 pointer-events-none"
          />
          <span
            aria-hidden="true"
            className="right-8 -bottom-8 absolute bg-cyan-300/20 rounded-full w-20 h-20 pointer-events-none"
          />

          <div className="relative flex justify-between items-center">
            <span className="bg-white shadow-md px-2 py-1 rounded-xl">
              <Link to={homePath} onClick={() => setOpen(false)}>
                {" "}
                <img
                  src="/Even_handler_Logo.png"
                  alt="Eventora logo"
                  className="w-auto h-8 object-contain"
                />
              </Link>
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="hover:bg-white/20 p-1.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white text-white hover:rotate-90 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <p className="relative mt-3 font-semibold text-sm truncate">
            Hi, {user ? user.name : "Guest"} 👋
          </p>
          <p className="relative text-sky-100 text-xs">
            {user
              ? `Logged in as ${user.role}`
              : "Let's plan something special"}
          </p>
        </div>

        {/* Links: icon chip + text, sab start (left) se */}
        <ul className="flex-1 space-y-1 px-3 py-3 overflow-y-auto">
          {allLinks.map((l, i) => {
            // Active link: current URL se pata chalta hai (case-insensitive)
            const isActive = pathname.toLowerCase() === l.to.toLowerCase();
            const { icon, text } = splitLabel(l.label);

            return (
              <li
                key={l.label}
                style={{ transitionDelay: open ? `${100 + i * 40}ms` : "0ms" }}
                className={`transition-all duration-300 motion-reduce:transition-none ${
                  open
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-3 opacity-0"
                }`}
              >
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex items-center justify-start gap-3 rounded-xl px-2 py-2 text-left text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isActive
                      ? "bg-sky-50 text-sky-700"
                      : "hover:bg-sky-50 hover:text-sky-700"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base transition group-hover:scale-110 ${
                      isActive ? "bg-white" : "bg-sky-50"
                    }`}
                  >
                    {icon}
                  </span>
                  <span className="flex-1 min-w-0 truncate">{text}</span>
                  <svg
                    className={`h-4 w-4 shrink-0 transition ${
                      isActive
                        ? "opacity-90"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9 6 6 6-6 6"
                    />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Neeche: guest ke liye Login + get started */}
        <div className="space-y-3 bg-sky-50/60 p-3 border-sky-100 border-t shrink-0">
          {!user && (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block bg-sky-600 hover:bg-sky-700 px-4 py-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 font-medium text-white text-sm text-center"
            >
              Login
            </Link>
          )}

          {/* <a
            href="#plan"
            onClick={() => setOpen(false)}
            className="group/cta inline-flex items-center gap-1 focus:outline-none font-semibold text-sky-700 hover:text-sky-900 text-xs text-left focus-visible:underline"
          >
            Get started
            <span className="transition-transform group-hover/cta:translate-x-1">
              →
            </span>
          </a> */}
        </div>
      </aside>
    </>
  );
}
