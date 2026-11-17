import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomePath } from "../utils/roles";

// Jab koi galat role wala user kisi restricted page par aaye
export default function Unauthorized() {
  const { user } = useAuth();

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 py-12 min-h-screen">
      <div className="bg-white shadow-md p-8 sm:p-10 rounded-2xl w-full max-w-md text-center">
        <p className="mb-4 text-5xl">🚫</p>
        <h1 className="font-bold text-gray-900 text-2xl">Access nahi hai</h1>
        <p className="mt-3 mb-8 text-gray-500 text-sm">
          Aapke account ({user?.role || "guest"}) ko is page ko dekhne ki
          permission nahi hai.
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