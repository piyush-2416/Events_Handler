import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../Components/Navbar";

// Vendor ka dashboard (abhi basic hai, baad me apni services/bookings yahan jodna)
export default function VendorDashboard() {
  const { user } = useAuth();

  const cards = [
    { title: "Meri Services", desc: "Apni services add ya edit karo", icon: "🛍️", to: null },
    { title: "Bookings", desc: "Aane wali booking requests dekho", icon: "📅", to: "/bookings" },
    { title: "Reviews", desc: "Customers ke reviews dekho", icon: "⭐", to: "/reviews" },
    { title: "AI Problem Solver", desc: "AI se apne business ke sawaal solve karo", icon: "🤖", to: "/solver" },
  ];

  return (

    <div className="bg-gray-50 px-4 py-12 min-h-screen">
        <Navbar/>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
          <div>
            <h1 className="font-bold text-gray-900 text-2xl">
              Vendor Dashboard
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              Welcome, {user?.name} 👋
            </p>
          </div>
          <Link
            to="/profile"
            className="hover:bg-white px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm"
          >
            Profile
          </Link>
        </div>

        <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => {
            const card = (
              <div className="bg-white shadow-sm p-6 border border-gray-100 hover:border-sky-200 rounded-2xl h-full transition-colors">
                <p className="mb-4 text-3xl">{c.icon}</p>
                <h2 className="font-semibold text-gray-900">{c.title}</h2>
                <p className="mt-2 text-gray-500 text-sm">{c.desc}</p>
              </div>
            );

            return c.to ? (
              <Link key={c.title} to={c.to}>
                {card}
              </Link>
            ) : (
              <div key={c.title}>{card}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}