import { Link } from "react-router-dom";

// Apne routes ke hisaab se badal lo
const FEATURES = [
  {
    to: "/solver",
    icon: "🧠",
    title: "AI Problem Solver",
    desc: "Last-minute problem likho, steps aur backup plan pao.",
    cta: "Problem batao",
    grad: "from-violet-600 to-sky-500",
  },
  {
    to: "/invitation",
    icon: "💌",
    title: "Interactive Invitation",
    desc: "Envelope, countdown aur WhatsApp RSVP wala invite banao.",
    cta: "Invitation banao",
    grad: "from-rose-500 to-amber-500",
  },
  {
    to: "/Budgetplanner",
    icon: "💰",
    title: "Budget Planner",
    desc: "Event type aur guests batao, category-wise budget pao.",
    cta: "Budget banao",
    grad: "from-emerald-600 to-sky-500",
  },
  {
    to: "/guestlist/1",
    icon: "📇",
    title: "Smart Guest List",
    desc: "CSV upload karo, call ya WhatsApp karo, RSVP track karo.",
    cta: "Guests add karo",
    grad: "from-sky-600 to-indigo-600",
  },
];

export default function FeatureStudio() {
  return (
    <div className="mx-auto px-4 py-8 sm:py-10 max-w-6xl" id="toolkit">
      {/* Heading */}
      <div className="flex items-start gap-3">
        <span className="flex justify-center items-center bg-sky-100 rounded-xl w-10 h-10 text-xl">✨</span>
        <div>
          <h2 className="font-bold text-slate-900 text-xl sm:text-2xl">Smart Event Toolkit</h2>
          <p className="text-slate-500 text-sm">Event plan karne ke saare tools ek jagah</p>
        </div>
      </div>

      {/* Compact cards */}
      <div className="gap-3 grid sm:grid-cols-2 lg:grid-cols-4 mt-5">
        {FEATURES.map((f) => (
          <Link
            key={f.title}
            to={f.to}
            className="group flex items-start gap-3 bg-white shadow-sm hover:shadow-lg hover:shadow-sky-200/60 p-4 border border-sky-100 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 transition duration-300"
          >
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl ${f.grad}`}>
              {f.icon}
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-base">{f.title}</h3>
              <p className="mt-0.5 text-slate-500 text-sm leading-snug">{f.desc}</p>
              <span className="inline-block mt-2 font-semibold text-sky-700 group-hover:text-sky-900 text-sm">
                {f.cta} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
