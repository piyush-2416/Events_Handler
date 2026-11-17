import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomePath } from "../utils/roles";

// Signup pe sirf ye 2 options (admin yahan se nahi banta)
const ROLE_OPTIONS = [
  { value: "user", title: "Customer", desc: "Event plan karna hai" },
  { value: "vendor", title: "Vendor", desc: "Apni services dikhani hain" },
];

export default function Signup() {
  const { user, signup } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup(form.name, form.email, form.password, role);
      // Redirect neeche wala <Navigate> khud kar dega
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  // Already logged in -> role ke hisaab se sahi page par bhejo
  if (user) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 py-12 min-h-screen">
      <div className="bg-white shadow-md p-8 sm:p-10 rounded-2xl w-full max-w-md">
        <h1 className="font-bold text-gray-900 text-2xl">Account banao</h1>
        <p className="mt-2 mb-8 text-gray-500 text-sm">
          Eventora pe apna event plan karna shuru karo
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role select */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Main kaun hoon?
            </label>
            <div className="gap-3 grid grid-cols-2">
              {ROLE_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                    role === r.value
                      ? "border-sky-600 bg-sky-50 ring-1 ring-sky-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="block font-semibold text-gray-900 text-sm">
                    {r.title}
                  </span>
                  <span className="block mt-1 text-gray-500 text-xs">
                    {r.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Naam
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Aapka naam"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Kam se kam 6 characters"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-full"
            />
          </div>

          {error && (
            <p className="bg-red-50 px-4 py-3 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-sky-600 hover:bg-sky-700 disabled:opacity-60 py-3 rounded-lg w-full font-semibold text-white transition-colors"
          >
            {submitting ? "Account ban raha hai..." : "Sign up"}
          </button>
        </form>

        <p className="mt-8 text-gray-500 text-sm text-center">
          Pehle se account hai?{" "}
          <Link to="/login" className="font-medium text-sky-600 hover:underline">
            Login karo
          </Link>
        </p>
      </div>
    </div>
  );
}