import React, { useState } from "react";

function App() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: "▣" },
    { name: "Events", icon: "📅" },
    { name: "Attendees", icon: "👥" },
    { name: "Tickets", icon: "🎟️" },
    { name: "Analytics", icon: "📊" },
    { name: "Payments", icon: "💳" },
    { name: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center bg-gray-950 shadow-lg px-5 h-16 text-white">

        {/* Sidebar Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex justify-center items-center bg-gray-900 hover:bg-blue-600 rounded-xl w-10 h-10 text-xl transition"
        >
          {open ? "☰" : "☰"}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 ml-4">

          <div className="flex justify-center items-center bg-blue-600 rounded-xl w-9 h-9 font-bold">
            E
          </div>

          {open && (
            <h1 className="font-bold text-xl">
              Event<span className="text-blue-500">Handler</span>
            </h1>
          )}

        </div>


        {/* Right */}
        <div className="flex items-center gap-5 ml-auto">

          <button className="relative text-gray-400 hover:text-white">
            🔔
            <span className="-top-1 -right-1 absolute bg-red-500 rounded-full w-2 h-2">
            </span>
          </button>

          <div className="flex items-center gap-2">

            <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-9 h-9 font-bold">
              P
            </div>

            {open && (
              <div className="hidden sm:block">
                <p className="font-semibold text-sm">Piyush</p>
                <p className="text-gray-500 text-xs">Organizer</p>
              </div>
            )}

          </div>

        </div>

      </nav>


      {/* ================= BODY ================= */}
      <div className="flex">


        {/* ================= SIDEBAR ================= */}
        <aside
          className={`min-h-[calc(100vh-4rem)]
          bg-gray-950 text-gray-400
          border-r border-gray-800
          transition-all duration-300 ease-in-out
          ${open ? "w-64" : "w-20"}`}
        >

          <div className="p-3">

            {/* Menu Title */}
            {open && (
              <p className="mt-2 mb-4 px-3 text-gray-600 text-xs uppercase tracking-widest">
                Main Menu
              </p>
            )}


            {/* MENU */}
            <div className="space-y-2">

              {menuItems.map((item) => (

                <button
                  key={item.name}
                  onClick={() => setActive(item.name)}
                  className={`w-full flex items-center
                    ${open ? "gap-3 px-4" : "justify-center"}
                    py-3 rounded-xl transition-all duration-200

                    ${
                      active === item.name
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "hover:bg-gray-900 hover:text-white"
                    }
                  `}
                >

                  <span className="text-lg">
                    {item.icon}
                  </span>

                  {open && (
                    <span className="font-medium">
                      {item.name}
                    </span>
                  )}

                </button>

              ))}

            </div>

          </div>


          {/* ================= SUPPORT ================= */}
           


        {/* ================= CONTENT ================= */}
        <main className="flex-1 p-8">

          <div className="mx-auto max-w-6xl">

            <h1 className="font-bold text-gray-900 text-3xl">
              {active}
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your {active.toLowerCase()} from here.
            </p>


            {/* Demo Card */}
            <div className="gap-5 grid md:grid-cols-3 mt-8">

              <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-2xl">
                <p className="text-gray-500">Total Events</p>
                <h2 className="mt-2 font-bold text-3xl">24</h2>
              </div>

              <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-2xl">
                <p className="text-gray-500">Attendees</p>
                <h2 className="mt-2 font-bold text-3xl">1,284</h2>
              </div>

              <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-2xl">
                <p className="text-gray-500">Revenue</p>
                <h2 className="mt-2 font-bold text-3xl">
                  ₹84,500
                </h2>
              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default App;