import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomePath } from "../utils/roles";

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();

  // ProtectedRoute se aaye the to login ke baad wapas wahin bhejenge
  const redirectTo = location.state?.from || null;

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      // Redirect neeche wala <Navigate> khud kar dega (user set hote hi)
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  // Already logged in (ya abhi login hua) -> role ke hisaab se sahi page par bhejo
  if (user) {
    return <Navigate to={redirectTo || getHomePath(user.role)} replace />;
  }

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 py-12 min-h-screen">
      <div className="bg-white shadow-md p-8 sm:p-10 rounded-2xl w-full max-w-md">
        <h1 className="font-bold text-gray-900 text-2xl">Wapas swagat hai</h1>
        <p className="mt-2 mb-8 text-gray-500 text-sm">
          Apne Eventora account me login karo
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Apna password"
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
            {submitting ? "Login ho raha hai..." : "Login"}
          </button>
        </form>

        <p className="mt-8 text-gray-500 text-sm text-center">
          Naya user ho?{" "}
          <Link to="/signup" className="font-medium text-sky-600 hover:underline">
            Account banao
          </Link>
        </p>
      </div>
    </div>
  );
}