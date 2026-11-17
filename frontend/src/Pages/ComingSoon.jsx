import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomePath } from "../utils/roles";

// Un pages ke liye placeholder jo abhi bane nahi hain (My Events, Bookings, Wishlist, Reviews)
export default function ComingSoon({ title = "Ye page" }) {
  const { user } = useAuth();

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 py-12 min-h-screen">
      <div className="bg-white shadow-md p-8 sm:p-10 rounded-2xl w-full max-w-md text-center">
        <p className="mb-4 text-5xl">🚧</p>
        <h1 className="font-bold text-gray-900 text-2xl">{title}</h1>
        <p className="mt-3 mb-8 text-gray-500 text-sm">
          Ye page abhi ban raha hai. Jaldi hi aayega!
        </p>
        <Link
          to={user ? getHomePath(user.role) : "/"}
          className="inline-block bg-sky-600 hover:bg-sky-700 px-6 py-3 rounded-lg font-semibold text-white transition-colors"
        >
          Wapas jao
        </Link>
      </div>
    </div>
  );
}