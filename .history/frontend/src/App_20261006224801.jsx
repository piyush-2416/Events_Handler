import React from "react";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ================= NAVBAR ================= */}
      <nav className="flex justify-between items-center bg-gray-950 shadow-lg px-6 h-16 text-white">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-blue-600 rounded-xl w-10 h-10 font-bold text-lg">
            E
          </div>

          <h1 className="font-bold text-xl tracking-wide">
            Event<span className="text-blue-500">Handler</span>
          </h1>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-900 px-4 border border-gray-800 rounded-xl w-96">
          <span className="text-gray-500">⌕</span>

          <input
            type="text"
            placeholder="Search events..."
            className="bg-transparent px-3 py-2 outline-none w-full text-white text-sm placeholder-gray-500"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">

          {/* Notification */}
          <button className="relative text-gray-400 hover:text-white transition">
            🔔
            <span className="-top-1 -right-1 absolute bg-red-500 rounded-full w-2 h-2"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 cursor-pointer">

            <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-9 h-9 font-bold">
              P
            </div>

            <div className="hidden sm:block">
              <p className="font-semibold text-sm">Piyush</p>
              <p className="text-gray-500 text-xs">Organizer</p>
            </div>

            <span className="text-gray-500">⌄</span>

          </div>

        </div>
      </nav>


      {/* ================= MAIN AREA ================= */}
      <div className="flex">

        {/* ================= SIDEBAR ================= */}
        <aside className="flex flex-col justify-between bg-gray-950 border-gray-800 border-t w-64 min-h-[calc(100vh-4rem)] text-gray-400">

          {/* Menu */}
          <div className="p-4">

            <p className="mb-4 px-3 text-gray-600 text-xs uppercase tracking-widest">
              Main Menu
            </p>

            <div className="space-y-1">

              <a className="flex items-center gap-3 bg-blue-600 shadow-blue-600/20 shadow-lg px-4 py-3 rounded-xl text-white cursor-pointer">
                <span>▣</span>
                <span className="font-medium">Dashboard</span>
              </a>

              <a className="flex items-center gap-3 hover:bg-gray-900 px-4 py-3 rounded-xl hover:text-white transition cursor-pointer">
                <span>📅</span>
                <span>Events</span>
              </a>

              <a className="flex items-center gap-3 hover:bg-gray-900 px-4 py-3 rounded-xl hover:text-white transition cursor-pointer">
                <span>👥</span>
                <span>Attendees</span>
              </a>

              <a className="flex items-center gap-3 hover:bg-gray-900 px-4 py-3 rounded-xl hover:text-white transition cursor-pointer">
                <span>🎟️</span>
                <span>Tickets</span>
              </a>

              <a className="flex items-center gap-3 hover:bg-gray-900 px-4 py-3 rounded-xl hover:text-white transition cursor-pointer">
                <span>📊</span>
                <span>Analytics</span>
              </a>

            </div>


            <p className="mt-8 mb-4 px-3 text-gray-600 text-xs uppercase tracking-widest">
              Management
            </p>

            <div className="space-y-1">

              <a className="flex items-center gap-3 hover:bg-gray-900 px-4 py-3 rounded-xl hover:text-white transition cursor-pointer">
                <span>💳</span>
                <span>Payments</span>
              </a>

              <a className="flex items-center gap-3 hover:bg-gray-900 px-4 py-3 rounded-xl hover:text-white transition cursor-pointer">
                <span>⚙️</span>
                <span>Settings</span>
              </a>

            </div>

          </div>


          {/* Bottom Profile / Help */}
          <div className="p-4">

            <div className="bg-gray-900 p-4 border border-gray-800 rounded-2xl">

              <p className="font-semibold text-white text-sm">
                Need Help?
              </p>

              <p className="mt-1 text-gray-500 text-xs">
                Contact our support team.
              </p>

              <button className="bg-gray-800 hover:bg-gray-700 mt-3 py-2 rounded-lg w-full text-white text-sm transition">
                Contact Support
              </button>

            </div>

          </div>

        </aside>


        {/* ================= CONTENT ================= */}
        <main className="flex-1 p-8">

          <h2 className="font-bold text-gray-900 text-3xl">
            Dashboard
          </h2>

          <p className="mt-1 text-gray-500">
            Manage your events from one place.
          </p>

        </main>

      </div>

    </div>
  );
}

export default App;