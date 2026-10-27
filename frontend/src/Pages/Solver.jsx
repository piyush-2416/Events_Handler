import { useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";

const API_URL = "http://localhost:5000/api/solve";

// Image ko apne project mein save karke use karna zyada safe hai
// Jaise: src/assets/chatbot-photos.png -> import heroImg from "../assets/chatbot-photos.png"
const HERO_IMG = "https://messengerbot.app/wp-content/uploads/2025/08/chatbot-photos.png";

const EVENT_TYPES = [
  { name: "Baby Shower", emoji: "🍼" },
  { name: "Birthday", emoji: "🎂" },
  { name: "Corporate", emoji: "💼" },
  { name: "Engagement", emoji: "💍" },
  { name: "Festival", emoji: "🪔" },
  { name: "Haldi", emoji: "🌼" },
  { name: "Mehndi", emoji: "🌿" },
  { name: "Party", emoji: "🎉" },
  { name: "Sangeet", emoji: "🎶" },
  { name: "Wedding", emoji: "💒" },
];

const EXAMPLES = [
  { label: "🍽️ Caterer cancel", eventType: "Wedding", problem: "Shaadi se 2 din pehle caterer ne cancel kar diya, 300 guests hain." },
  { label: "🌧️ Baarish ka alert", eventType: "Birthday", problem: "Outdoor birthday party hai aur baarish ka alert hai, kya karun?" },
  { label: "⏰ Artist late hai", eventType: "Mehndi", problem: "Mehndi artist late aa rahi hai aur 40 log wait kar rahe hain." },
  { label: "💸 Budget kam hua", eventType: "Corporate", problem: "Budget 20% kam ho gaya par 100 logon ka event karna hai." },
];

const SEVERITY = {
  low: { label: "Halka", cls: "bg-emerald-100 text-emerald-800" },
  medium: { label: "Madhyam", cls: "bg-amber-100 text-amber-800" },
  high: { label: "Gambhir", cls: "bg-rose-100 text-rose-800" },
};

const fieldCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100";

export default function Solver() {
  const [eventType, setEventType] = useState("Wedding");
  const [problem, setProblem] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState(null);
  const [done, setDone] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imgOk, setImgOk] = useState(true);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);

  // Result aate hi us tak scroll karo
  useEffect(() => {
    if (!result) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [result]);

  const solve = async () => {
    setError("");
    if (problem.trim().length < 10) {
      setError("Problem thodi detail mein likho (kam se kam 10 characters).");
      return;
    }
    setLoading(true);
    setResult(null);
    setDone(new Set());
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          problem: problem.trim(),
          guests: guests ? Number(guests) : undefined,
          budget: budget ? Number(budget) : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Server error");
      setResult(data);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Backend se connect nahi ho paya. Server (port 5000) chal raha hai?"
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const toggle = (i) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const useExample = (ex) => {
    setEventType(ex.eventType);
    setProblem(ex.problem);
    setResult(null);
    setError("");
  };

  const steps = result?.steps ?? [];

  const copyChecklist = async () => {
    const text =
      `${eventType}: ${problem}\n\n` +
      steps.map((s, i) => `${i + 1}. ${s.title}${s.detail ? " - " + s.detail : ""}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy nahi ho paya. Browser permission check karo.");
    }
  };

  const reset = () => {
    setResult(null);
    setDone(new Set());
    setProblem("");
    setError("");
    document.getElementById("solver-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const sev = result && SEVERITY[result.severity];

  return (
    <div className="bg-slate-50 min-h-screen text-left">
      <Navbar />

      {/* ================= HERO ================= */}
      <header className="relative bg-gradient-to-br from-indigo-900 via-purple-800 to-sky-700 px-5 pt-14 sm:pt-20 pb-32 sm:pb-36 overflow-hidden">
        {/* Background image (load na ho to neeche ka gradient dikhega) */}
        {imgOk && (
          <img
            src={HERO_IMG}
            alt=""
            aria-hidden="true"
            onError={() => setImgOk(false)}
            className="absolute inset-0 w-full h-full object-cover object-right"
          />
        )}
        {/* Overlay: left side gehra taaki text saaf padhe, right side me image dikhe */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 max-md:from-indigo-950/85 via-purple-900/70 max-md:via-purple-900/80 to-sky-700/20 max-md:to-purple-800/70 pointer-events-none" />

        <div className="relative mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 border border-white/25 rounded-full font-medium text-white text-sm">
            <span className="bg-emerald-300 rounded-full w-2 h-2 motion-safe:animate-pulse" />
            AI Powered · Hinglish mein salah
          </span>
          <h1 className="drop-shadow-lg mt-4 font-extrabold text-white text-4xl sm:text-5xl tracking-tight">
            Event Problem{" "}
            <span className="bg-clip-text bg-gradient-to-r from-sky-200 via-pink-200 to-amber-200 text-transparent">Solver</span>
          </h1>
          <p className="drop-shadow mt-3 max-w-xl text-purple-50 text-lg">
            Event me last moment par koi dikkat aa gayi? Problem batao, AI turant step-by-step plan aur backup plan dega.
          </p>
        </div>
      </header>

      <main className="relative mx-auto -mt-16 px-5 pb-20 max-w-3xl">
        {/* ================= FORM ================= */}
        <div id="solver-form" className="bg-white shadow-purple-900/10 shadow-xl p-6 sm:p-8 rounded-3xl ring-1 ring-slate-100 scroll-mt-24">
          {/* Quick examples */}
          <div>
            <p className="font-semibold text-slate-700 text-sm">Jaldi try karo</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => useExample(ex)}
                  className="bg-purple-50 hover:bg-purple-100 px-3.5 py-1.5 border border-purple-100 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 font-medium text-purple-800 text-sm transition"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Event type chips */}
          <div className="mt-6">
            <p id="evt-label" className="font-semibold text-slate-700 text-sm">Event type</p>
            <div role="radiogroup" aria-labelledby="evt-label" className="flex flex-wrap gap-2 mt-2">
              {EVENT_TYPES.map((t) => {
                const on = eventType === t.name;
                return (
                  <button
                    key={t.name}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setEventType(t.name)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                      on
                        ? "border-transparent bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-blue-500/30"
                        : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50"
                    }`}
                  >
                    <span aria-hidden="true">{t.emoji}</span> {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guests + Budget */}
          <div className="gap-5 grid sm:grid-cols-2 mt-6">
            <label className="flex flex-col gap-2 font-semibold text-slate-700 text-sm">
              Guests (optional)
              <input className={fieldCls} type="number" min="1" inputMode="numeric" placeholder="Jaise: 100" value={guests} onChange={(e) => setGuests(e.target.value)} />
            </label>
            <label className="flex flex-col gap-2 font-semibold text-slate-700 text-sm">
              Budget ₹ (optional)
              <input className={fieldCls} type="number" min="0" inputMode="numeric" placeholder="Jaise: 150000" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </label>
          </div>

          {/* Problem */}
          <label className="flex flex-col gap-2 mt-5 font-semibold text-slate-700 text-sm">
            Problem kya hai?
            <textarea
              className={`${fieldCls} resize-none`}
              rows={4}
              maxLength={500}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Jaise: caterer ne last moment par cancel kar diya..."
            />
            <small className={`self-end text-xs font-normal ${problem.length < 10 ? "text-slate-400" : "text-emerald-600"}`}>
              {problem.length}/500
            </small>
          </label>

          <button
            type="button"
            onClick={solve}
            disabled={loading}
            aria-busy={loading}
            className="flex justify-center items-center gap-2 bg-gradient-to-r from-sky-500 hover:from-sky-600 to-blue-600 hover:to-blue-700 disabled:opacity-70 shadow-blue-500/30 shadow-lg hover:shadow-xl mt-4 py-3.5 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 w-full font-semibold text-white transition disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                Solution soch raha hai...
              </>
            ) : (
              <>Solution batao <span aria-hidden="true">→</span></>
            )}
          </button>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div role="alert" className="bg-rose-50 mt-6 px-5 py-4 border border-rose-200 rounded-2xl text-rose-700 text-sm">
            {error}
          </div>
        )}

        {/* ================= LOADING SKELETON ================= */}
        {loading && (
          <div className="space-y-4 mt-8" aria-hidden="true">
            {[0, 1].map((n) => (
              <div key={n} className="bg-white p-6 rounded-3xl ring-1 ring-slate-100">
                <div className="bg-slate-200 rounded-full w-1/3 h-5 motion-safe:animate-pulse" />
                <div className="bg-slate-100 mt-4 rounded-full w-full h-3 motion-safe:animate-pulse" />
                <div className="bg-slate-100 mt-2 rounded-full w-4/5 h-3 motion-safe:animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* ================= RESULT ================= */}
        {result && (
          <div ref={resultRef} className="space-y-5 mt-8 scroll-mt-24" aria-live="polite">
            {result.emergency && (
              <div role="alert" className="bg-gradient-to-r from-rose-700 to-red-600 shadow-lg shadow-rose-300/40 p-5 rounded-2xl text-white">
                <b>Jaan ka khatra ho to pehle 112 (police/fire) ya 108 (ambulance) par call karo.</b>{" "}
                Neeche ke steps uske baad follow karein.
              </div>
            )}
            {result.fallback && (
              <div className="bg-amber-50 px-5 py-4 border border-amber-200 rounded-2xl text-amber-800 text-sm">
                AI abhi available nahi hai, isliye ye general checklist hai. Thodi der baad dobara try karo.
              </div>
            )}

            {/* Summary */}
            <section className="bg-white shadow-md shadow-purple-900/5 p-6 rounded-3xl ring-1 ring-slate-100">
              <div className="flex justify-between items-center gap-3">
                <h2 className="font-bold text-slate-900 text-xl">Summary</h2>
                {sev && <span className={`rounded-full px-3.5 py-1 text-xs font-bold ${sev.cls}`}>{sev.label}</span>}
              </div>
              <p className="mt-3 text-slate-600 leading-relaxed">{result.summary}</p>
            </section>

            {/* Steps */}
            <section className="bg-white shadow-md shadow-purple-900/5 p-6 rounded-3xl ring-1 ring-slate-100">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="font-bold text-slate-900 text-xl">Kya karna hai</h2>
                <div className="flex items-center gap-2">
                  <span className="bg-sky-100 px-3.5 py-1 rounded-full font-semibold text-sky-700 text-xs">
                    {done.size}/{steps.length} ho gaye
                  </span>
                  <button
                    type="button"
                    onClick={copyChecklist}
                    className="hover:bg-slate-50 px-3.5 py-1 border border-slate-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 font-semibold text-slate-700 text-xs transition"
                  >
                    {copied ? "Copy ho gaya ✓" : "Checklist copy karo"}
                  </button>
                </div>
              </div>

              <div className="bg-slate-100 mt-4 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 rounded-full h-full transition-all duration-300"
                  style={{ width: `${steps.length ? (done.size / steps.length) * 100 : 0}%` }}
                />
              </div>

              <ol className="mt-3 divide-y divide-slate-100">
                {steps.map((s, i) => {
                  const isDone = done.has(i);
                  return (
                    <li key={i}>
                      <label className="flex items-start gap-3 py-4 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggle(i)}
                          className="mt-1 w-5 h-5 accent-sky-600 cursor-pointer shrink-0"
                        />
                        <span className={`flex flex-col gap-0.5 transition ${isDone ? "opacity-50" : ""}`}>
                          <b className={`text-slate-900 ${isDone ? "line-through" : ""}`}>{s.title}</b>
                          {s.detail && (
                            <em className={`text-sm not-italic leading-relaxed text-slate-600 ${isDone ? "line-through" : ""}`}>
                              {s.detail}
                            </em>
                          )}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* Backup plan + Dont forget */}
            {(result.backupPlan || result.dontForget?.length > 0) && (
              <div className="gap-5 grid md:grid-cols-2">
                {result.backupPlan && (
                  <section className="bg-gradient-to-br from-indigo-900 via-purple-800 to-purple-600 shadow-lg shadow-purple-900/20 p-6 rounded-3xl text-white">
                    <h3 className="font-bold text-lg">🛟 Backup plan</h3>
                    <p className="mt-2 text-purple-100 leading-relaxed">{result.backupPlan}</p>
                  </section>
                )}
                {result.dontForget?.length > 0 && (
                  <section className="bg-amber-50 p-6 border border-amber-200 rounded-3xl">
                    <h3 className="font-bold text-amber-900 text-lg">📌 Ye mat bhoolna</h3>
                    <ul className="space-y-1.5 mt-2 pl-5 text-amber-900/90 list-disc">
                      {result.dontForget.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </section>
                )}
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center gap-3">
              <p className="text-slate-400 text-sm">
                Ye AI ke sujhav hain, final decision se pehle vendors aur prices khud confirm karo.
              </p>
              <button
                type="button"
                onClick={reset}
                className="bg-white hover:bg-sky-50 px-5 py-2 border border-slate-200 hover:border-sky-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 font-semibold text-slate-700 text-sm transition"
              >
                Nayi problem
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
