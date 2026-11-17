/* Shared data: Navbar, Footer aur Home teeno isse use karte hain */

/* ---------- Role ke hisaab se sidebar links ---------- */

// Login nahi hai (guest): sirf browse karne wale pages
const guestLinks = [
  { label: "🏠 Home", to: "/" },
  { label: "🔍 Explore Events", to: "/events" },
  { label: "🏛️ Venues", to: "/Venues" },
  { label: "🤝 Vendors", to: "/Vendors" },
  { label: "📦 Packages", to: "/packages" },
];

// Customer: browse + planning tools + bookings
const customerLinks = [
  // 🏠 Dashboard
  { label: "🏠 Home", to: "/" },

  // 🔍 Explore
  { label: "🔍 Explore Events", to: "/events" },
  { label: "🏛️ Venues", to: "/Venues" },
  { label: "🤝 Vendors", to: "/Vendors" },
  { label: "📦 Packages", to: "/packages" },

  // 📝 Event Planning Tools
  { label: "💰 Budget Planner", to: "/Budgetplanner" },
  { label: "💌 Create Invitation", to: "/create-invitation" },
  // Guest list har event ki alag hoti hai, isliye pehle event chuno (/guestlist/:eventId)
  { label: "👥 Guest List", to: "/Guestlist" },
  { label: "🤖 AI Problem Solver", to: "/solver" },
  // { label: "✨ AI Feature Studio", to: "/Featurestudio" },

  // 📋 Event Management
  // { label: "🎉 My Events", to: "/my-events" },
  { label: "🎟️ My Bookings", to: "/MyBookings" },
  { label: "❤️ Wishlist", to: "/wishlist" },

  // 👤 Account & Feedback
  { label: "⭐ Reviews & Feedback", to: "/Feedback" },
  { label: "👤 My Profile", to: "/profile" },
];

// Vendor: Home/Events/Vendors/Packages nahi, sirf apna kaam
const vendorLinks = [
  { label: "📊 Dashboard", to: "/vendor-dashboard" },
  { label: "🤖 AI Problem Solver", to: "/solver" },
  // { label: "✨ AI Feature Studio", to: "/Featurestudio" },
  { label: "🎟️ My Bookings", to: "/MyBookings" },
  { label: "⭐ Reviews & Feedback", to: "/reviews" },
  { label: "👤 My Profile", to: "/profile" },
];

// Admin: admin panel + browsing
const adminLinks = [
  { label: "🛠️ Admin Panel", to: "/admin" },
  { label: "📊 Vendor Dashboard", to: "/vendor-dashboard" },
  { label: "🏠 Home", to: "/" },
  { label: "🔍 Explore Events", to: "/events" },
  { label: "🏛️ Venues", to: "/Venues" },
  { label: "🤝 Vendors", to: "/Vendors" },
  { label: "📦 Packages", to: "/packages" },
  { label: "🤖 AI Problem Solver", to: "/solver" },
  { label: "👤 My Profile", to: "/profile" },
];

const LINKS_BY_ROLE = {
  user: customerLinks,
  vendor: vendorLinks,
  admin: adminLinks,
};

// Navbar me use hota hai: getLinksForRole(user?.role)
export const getLinksForRole = (role) => LINKS_BY_ROLE[role] || guestLinks;

// Purana export: Footer aur Home isi ko use karte hain, isliye naam same rakha hai
export const links = customerLinks;

export const categories = [
  { name: "Weddings", sub: "Make it magical", icon: "💍", bg: "bg-rose-50" },
  { name: "Birthdays", sub: "Celebrate life", icon: "🎂", bg: "bg-orange-50" },
  { name: "Corporate", sub: "Build together", icon: "💼", bg: "bg-sky-50" },
  { name: "Engagement", sub: "Say yes", icon: "💖", bg: "bg-pink-50" },
  { name: "Anniversary", sub: "Cherish moments", icon: "🥂", bg: "bg-sky-100" },
  {
    name: "Baby Shower",
    sub: "Little beginnings",
    icon: "🍼",
    bg: "bg-teal-50",
  },
  { name: "Parties", sub: "Good vibes", icon: "🎉", bg: "bg-amber-50" },
  {
    name: "Festivals",
    sub: "Feel the culture",
    icon: "🪔",
    bg: "bg-yellow-50",
  },
  { name: "Exhibitions", sub: "Explore & grow", icon: "🏛️", bg: "bg-sky-50" },
  { name: "More", sub: "& much more", icon: "🔳", bg: "bg-sky-100" },
];
