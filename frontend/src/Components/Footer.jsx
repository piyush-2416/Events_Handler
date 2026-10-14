import { useState } from "react";
import { links, categories } from "../data";

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
export default function Footer() {
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