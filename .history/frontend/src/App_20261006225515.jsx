import { useEffect, useRef, useState } from "react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

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
      <header className="top-0 z-30 fixed inset-x-0 bg-white/90 backdrop-blur border-slate-200 border-b">
        <nav className="flex justify-between items-center mx-auto px-4 max-w-6xl h-16">
          <div className="flex items-center gap-3">
            <button
              ref={toggleBtnRef}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="sidebar"
              className="hover:bg-slate-100 p-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-slate-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <a href="#home" className="font-bold text-slate-900 text-xl">
              Brand<span className="text-indigo-600">.</span>
            </a>
          </div>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="hover:bg-slate-100 px-3 py-2 rounded-lg font-medium text-slate-600 hover:text-slate-900 text-sm"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold text-white text-sm"
          >
            Get started
          </a>
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
          <span className="font-bold text-slate-900 text-lg">
            Brand<span className="text-indigo-600">.</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="hover:bg-slate-100 p-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-slate-600"
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
                className="block hover:bg-indigo-50 focus:bg-indigo-50 px-3 py-2.5 rounded-lg focus:outline-none font-medium text-slate-700 hover:text-indigo-700 focus:text-indigo-700 text-sm"
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
            className="block bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-lg font-semibold text-white text-sm text-center"
          >
            Get started
          </a>
        </div>
      </aside>

      {/* Demo content (apne page se replace karein) */}
      <main className="bg-slate-50 px-4 pt-24 min-h-screen">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-bold text-slate-900 text-3xl">Welcome</h1>
          <p className="mt-2 text-slate-600">Left wale menu icon par click karke sidebar kholein.</p>
        </div>
      </main>
    </>
  );
}