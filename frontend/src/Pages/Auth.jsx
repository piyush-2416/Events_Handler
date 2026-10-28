import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

/* ---------- apne backend / routes ke hisaab se yahan badal sakte ho ---------- */
const ENDPOINTS = { login: "/auth/login", signup: "/auth/register" };
const AFTER_AUTH_PATH = "/"; // login ke baad kahan bhejna hai
const FORGOT_PATH = "/forgot-password";
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
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 118 0v3",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
  eyeOff:
    "M3 3l18 18M10.6 6.2A9.8 9.8 0 0112 6c6.5 0 10 6 10 6a17 17 0 01-3.2 3.9M6.6 6.7A17 17 0 002 12s3.5 6 10 6c1.6 0 3-.3 4.3-.9M9.9 9.9a3 3 0 004.2 4.2",
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
  alert: "M12 4l9 16H3L12 4zM12 10v4M12 17.5v.01",
  check: "M5 12.5l4.5 4.5L19 7.5",
  instagram:
    "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zM12 16a4 4 0 100-8 4 4 0 000 8zM17.5 6.5h.01",
  facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
  twitter:
    "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
  linkedin:
    "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z",
};

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);
const GithubLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-900" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 00-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 015.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0012 .5z" />
  </svg>
);

/* ---------- content ---------- */
const HERO_POINTS = [
  { icon: ICONS.bolt, lines: ["Smart", "Planning"] },
  { icon: ICONS.users, lines: ["Easy", "Collaboration"] },
  { icon: ICONS.shield, lines: ["Stress Free", "Events"] },
];

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

/* ---------- styles: halki entrance + hover ---------- */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.au-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }

@keyframes au-zoom { from { transform: scale(1.08); } to { transform: scale(1); } }
@keyframes au-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes au-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

.au-img  { animation: au-zoom 1.6s cubic-bezier(.2,.7,.2,1) both; }
.au-in-1 { animation: au-rise .7s .1s  cubic-bezier(.2,.7,.2,1) both; }
.au-in-2 { animation: au-rise .7s .22s cubic-bezier(.2,.7,.2,1) both; }
.au-in-3 { animation: au-rise .7s .34s cubic-bezier(.2,.7,.2,1) both; }
.au-swap { animation: au-fade .3s ease-out both; }

@media (prefers-reduced-motion: reduce) {
  .au-img, .au-in-1, .au-in-2, .au-in-3, .au-swap { animation: none; }
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

function Input({ icon, type = "text", value, onChange, placeholder, autoComplete, minLength }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="relative">
      <Icon d={icon} className="top-1/2 left-3.5 absolute w-[18px] h-[18px] text-slate-400 -translate-y-1/2" />
      <input
        type={isPassword && show ? "text" : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        required
        className="bg-white pr-11 pl-11 border border-slate-200 focus:border-emerald-600 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20 w-full h-12 text-slate-800 placeholder:text-slate-400 text-sm transition"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Password chhupao" : "Password dikhao"}
          className="top-1/2 right-3.5 absolute text-slate-500 hover:text-emerald-700 transition-colors -translate-y-1/2"
        >
          <Icon d={show ? ICONS.eyeOff : ICONS.eye} className="w-[18px] h-[18px]" />
        </button>
      )}
    </div>
  );
}

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem("remembered_email") || "";
    } catch {
      return "";
    }
  });
  const [remember, setRemember] = useState(() => {
    try {
      return !!localStorage.getItem("remembered_email");
    } catch {
      return false;
    }
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isLogin = mode === "login";

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setNotice("");
  };

  const goSignup = () => {
    switchMode("signup");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLogin = (provider) => {
    // backend par /auth/google aur /auth/github routes hone chahiye
    const base = (api.defaults?.baseURL || "").replace(/\/$/, "");
    window.location.href = `${base}/auth/${provider}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const payload = isLogin ? { email, password } : { name, email, password };
      const res = await api.post(isLogin ? ENDPOINTS.login : ENDPOINTS.signup, payload);

      let data = res.data;
      if (data && data.data) data = data.data;

      if (data?.token) {
        localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        // "Remember me": sirf email yaad rakhta hai taaki agli baar prefill ho
        if (remember) localStorage.setItem("remembered_email", email);
        else localStorage.removeItem("remembered_email");
        navigate(AFTER_AUTH_PATH);
      } else if (!isLogin) {
        // signup ho gaya par token nahi mila, to login par bhej do
        setMode("login");
        setPassword("");
        setNotice("Account ban gaya. Ab login karo.");
      } else {
        throw new Error("Login response me token nahi mila");
      }
    } catch (err) {
      console.error("Auth error:", err.response?.status, err.response?.data || err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          (err.response?.status === 401 ? "Email ya password galat hai" : "Kuch gadbad hui, dobara try karo")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-slate-800 au-root">
      <style>{styles}</style>

      {/* ================= HERO + FORM ================= */}
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

          {/* ---------- right: auth card ---------- */}
          <div className="lg:justify-self-end w-full max-w-md au-in-2">
            <div className="bg-white shadow-2xl shadow-slate-950/30 rounded-2xl overflow-hidden">
              {/* tabs */}
              <div role="tablist" className="flex mx-7 mt-7 border-slate-200 border-b">
                {[
                  ["login", "Login"],
                  ["signup", "Sign Up"],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    role="tab"
                    aria-selected={mode === val}
                    onClick={() => switchMode(val)}
                    className={`-mb-px flex-1 border-b-2 pb-3 text-[15px] font-semibold transition-colors ${
                      mode === val
                        ? "border-emerald-700 text-emerald-700"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div key={mode} className="p-7 pt-6 au-swap">
                {notice && (
                  <p className="flex items-center gap-2 bg-emerald-50 mb-4 px-4 py-3 rounded-lg text-emerald-700 text-sm">
                    <Icon d={ICONS.check} className="flex-shrink-0 w-4 h-4" /> {notice}
                  </p>
                )}
                {error && (
                  <p
                    role="alert"
                    className="flex items-start gap-2 bg-red-50 mb-4 px-4 py-3 rounded-lg text-red-600 text-sm"
                  >
                    <Icon d={ICONS.alert} className="flex-shrink-0 mt-0.5 w-4 h-4" /> {error}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <Input
                      icon={ICONS.user}
                      value={name}
                      onChange={setName}
                      placeholder="Full name"
                      autoComplete="name"
                    />
                  )}
                  <Input
                    icon={ICONS.mail}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="Email address"
                    autoComplete="email"
                  />
                  <Input
                    icon={ICONS.lock}
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    minLength={6}
                  />

                  {isLogin && (
                    <div className="flex justify-between items-center text-sm">
                      <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          className="border-slate-300 rounded w-4 h-4 accent-emerald-700"
                        />
                        Remember me
                      </label>
                      <Link to={FORGOT_PATH} className="font-medium text-emerald-700 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex justify-center items-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:opacity-60 shadow-emerald-900/20 hover:shadow-lg rounded-lg w-full h-12 font-semibold text-white text-sm transition-all disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="border-2 border-white/40 border-t-white rounded-full w-4 h-4 animate-spin" />
                        Please wait...
                      </>
                    ) : isLogin ? (
                      "Login"
                    ) : (
                      "Create account"
                    )}
                  </button>
                </form>

                {/* OR */}
                <div className="flex items-center gap-4 my-5 text-slate-500 text-xs">
                  <span className="flex-1 bg-slate-200 h-px" />
                  OR
                  <span className="flex-1 bg-slate-200 h-px" />
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => socialLogin("google")}
                    className="flex justify-center items-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg w-full h-12 font-medium text-slate-700 text-sm transition-colors"
                  >
                    <GoogleLogo /> Continue with Google
                  </button>
                  <button
                    type="button"
                    onClick={() => socialLogin("github")}
                    className="flex justify-center items-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg w-full h-12 font-medium text-slate-700 text-sm transition-colors"
                  >
                    <GithubLogo /> Continue with GitHub
                  </button>
                </div>

                <p className="mt-6 text-slate-600 text-sm text-center">
                  {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => switchMode(isLogin ? "signup" : "login")}
                    className="font-semibold text-emerald-700 hover:underline"
                  >
                    {isLogin ? "Sign Up" : "Login"}
                  </button>
                </p>
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
          <button
            onClick={goSignup}
            className="group inline-flex justify-center items-center gap-2 bg-emerald-300 hover:bg-emerald-200 px-6 py-3 rounded-lg font-semibold text-emerald-950 text-sm whitespace-nowrap transition-colors"
          >
            Get Started for Free
            <Icon d={ICONS.arrow} className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
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