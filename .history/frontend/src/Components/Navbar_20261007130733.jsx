import { useEffect, useRef, useState } from "react";
import { links } from "../data";

/* Sidebar ke neeche wali event image (public folder se). Yahan se badal sakte ho */
const SIDEBAR_IMAGE = "/Birthday_Party_offer.png";

/* NAVBAR + SIDEBAR (hamburger se sidebar khulta hai) */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const [active, setActive] = useState(links[0]?.label); // highlight hone wala link

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
              <a href="#home" className="flex items-center">
              <img
                src="/Even_handler_Logo.png"
                alt="Eventora logo"
                className="w-auto h-12 object-contain"
              />
            </a>
            </button>
            
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[80%] flex-col rounded-r-3xl bg-white shadow-2xl shadow-sky-900/20 outline-none transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header: logo (left) + close (right) */}
        <div className="flex justify-between items-center bg-gradient-to-r from-sky-50 to-white px-4 border-sky-100 border-b h-16 shrink-0">
          <img src="/Even_handler_Logo.png" alt="Eventora logo" className="w-auto h-10 object-contain" />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="hover:bg-sky-100 p-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 text-slate-600 hover:rotate-90 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <p className="px-5 pt-4 pb-1 font-semibold text-[11px] text-slate-400 text-left uppercase tracking-widest shrink-0">
          Menu
        </p>

        {/* Links: sab left (start) se aligned */}
        <ul className="flex-1 space-y-0.5 px-3 pb-3 overflow-y-auto">
          {links.map((l, i) => {
            const isActive = active === l.label;
            return (
              <li
                key={l.label}
                style={{ transitionDelay: open ? `${100 + i * 40}ms` : "0ms" }}
                className={`transition-all duration-300 motion-reduce:transition-none ${
                  open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                }`}
              >
                <a
                  href={l.href}
                  onClick={() => {
                    setActive(l.label);
                    setOpen(false);
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex items-center justify-start gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isActive
                      ? "bg-sky-100 text-sky-800"
                      : "text-slate-700 hover:translate-x-1 hover:bg-sky-50 hover:text-sky-700"
                  }`}
                >
                  {isActive && (
                    <span aria-hidden="true" className="top-1/2 left-0 absolute bg-sky-600 rounded-r-full w-1 h-5 -translate-y-1/2" />
                  )}
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Neeche: event image card */}
        <div className="p-3 border-sky-100 border-t shrink-0">
          <a
            href="#plan"
            onClick={() => setOpen(false)}
            className="group block bg-sky-100 shadow-md rounded-2xl focus:outline-none ring-1 ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-500 overflow-hidden"
          >
            <img
              src={SIDEBAR_IMAGE}
              alt="Plan your next event"
              loading="lazy"
              className="w-full h-28 object-center object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </a>
          <p className="mt-2 font-semibold text-slate-800 text-xs text-left">Plan your next celebration 🎉</p>
          <a
            href="#plan"
            onClick={() => setOpen(false)}
            className="group/cta inline-flex items-center gap-1 mt-0.5 focus:outline-none font-semibold text-sky-700 hover:text-sky-900 text-xs text-left focus-visible:underline"
          >
            Get started
            <span className="transition-transform group-hover/cta:translate-x-1">→</span>
          </a>
        </div>
      </aside>
    </>
  );
}