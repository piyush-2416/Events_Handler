import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Role ke hisaab se label aur quick links
const ROLE_INFO = {
  user: {
    label: "Customer",
    desc: "Aap events plan aur manage kar sakte ho",
    links: [
      { label: "Create Invitation", to: "/create-invitation", icon: "💌" },
      { label: "Budget Planner", to: "/Budgetplanner", icon: "💰" },
      { label: "Explore Vendors", to: "/Vendors", icon: "🛍️" },
      { label: "My Bookings", to: "/bookings", icon: "🎟️" },
    ],
  },
  vendor: {
    label: "Vendor",
    desc: "Aap apni services customers ko dikha sakte ho",
    links: [
      { label: "Vendor Dashboard", to: "/vendor-dashboard", icon: "🏪" },
      { label: "AI Problem Solver", to: "/solver", icon: "🤖" },
      { label: "My Bookings", to: "/bookings", icon: "🎟️" },
      { label: "Reviews & Feedback", to: "/reviews", icon: "⭐" },
    ],
  },
  admin: {
    label: "Admin",
    desc: "Aapke paas poore app ka access hai",
    links: [
      { label: "Admin Panel", to: "/admin", icon: "🛠️" },
      { label: "Vendor Dashboard", to: "/vendor-dashboard", icon: "🏪" },
      { label: "Create Invitation", to: "/create-invitation", icon: "💌" },
    ],
  },
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Ye page ProtectedRoute ke andar hai, to user hamesha milega
  if (!user) return null;

  const info = ROLE_INFO[user.role] || ROLE_INFO.user;
  const initial = user.name?.charAt(0).toUpperCase() || "?";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Details table ki rows
  const details = [
    { label: "Naam", value: user.name },
    { label: "Email", value: user.email },
    { label: "Role", value: info.label },
    { label: "Account ID", value: `#${user.id}` },
  ];

  return (
    <div className="bg-gray-50 px-4 py-12 min-h-screen">
      <div className="space-y-8 mx-auto w-full max-w-2xl">
        {/* Top: avatar + naam + role badge */}
        <div className="bg-white shadow-sm p-8 sm:p-10 border border-gray-100 rounded-2xl">
          <div className="flex sm:flex-row flex-col items-center sm:items-start gap-6 sm:text-left text-center">
            <div className="flex justify-center items-center bg-sky-600 rounded-full w-20 h-20 font-bold text-white text-3xl shrink-0">
              {initial}
            </div>

            <div className="min-w-0">
              <h1 className="font-bold text-gray-900 text-2xl truncate">
                {user.name}
              </h1>
              <p className="mt-1 text-gray-500 text-sm truncate">{user.email}</p>
              <span className="inline-block bg-sky-50 mt-4 px-4 py-1.5 rounded-full font-semibold text-sky-700 text-xs">
                {info.label}
              </span>
            </div>
          </div>
          <p className="mt-6 text-gray-500 text-sm sm:text-left text-center">
            {info.desc}
          </p>
        </div>

        {/* Profile details */}
        <div className="bg-white shadow-sm p-8 sm:p-10 border border-gray-100 rounded-2xl">
          <h2 className="mb-6 font-semibold text-gray-900 text-lg">
            Profile Details
          </h2>
          <dl className="divide-y divide-gray-100">
            {details.map((d) => (
              <div
                key={d.label}
                className="flex flex-wrap justify-between items-center gap-2 py-4"
              >
                <dt className="text-gray-500 text-sm">{d.label}</dt>
                <dd className="font-medium text-gray-900 text-sm break-all">
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Quick links (role ke hisaab se) */}
        {/* <div className="bg-white shadow-sm p-8 sm:p-10 border border-gray-100 rounded-2xl">
          <h2 className="mb-6 font-semibold text-gray-900 text-lg">
            Quick Links
          </h2>
          <div className="gap-4 grid sm:grid-cols-2">
            {info.links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="flex items-center gap-3 hover:bg-sky-50 px-5 py-4 border border-gray-200 hover:border-sky-200 rounded-xl font-medium text-gray-700 text-sm transition-colors"
              >
                <span className="text-xl">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>
        </div> */}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-white hover:bg-red-50 py-3.5 border border-red-200 rounded-xl w-full font-semibold text-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}