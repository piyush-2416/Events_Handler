import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "../Components/Navbar";

export default function CreateInvitation() {
  // Form ki values
  const [form, setForm] = useState({
    event: "",
    guest: "",
    date: "",
    venue: "",
  });
  const [link, setLink] = useState(""); // QR ke andar jaane wala link
  const qrRef = useRef(null);

  // Input badalne par state update
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Generate button dabane par invitation ka link banao
  const generate = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(form).toString();

    // Phone se test karna ho to .env me VITE_PUBLIC_URL=http://<laptop-IP>:5173 rakho
    const baseUrl = import.meta.env.VITE_PUBLIC_URL || window.location.origin;
    setLink(`${baseUrl}/invite?${params}`);
  };

  // QR ko PNG image banakar download karo
  const download = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${form.guest || "guest"}-invitation-qr.png`;
    a.click();
  };

  const input =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100";

  const label = "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      {/* ---- Hero banner ---- */}
      <header className="relative bg-gradient-to-br from-indigo-950 via-purple-800 to-pink-600 px-5 pt-14 pb-28 overflow-hidden">
        <div className="-top-24 -right-20 absolute bg-orange-400/30 blur-3xl rounded-full w-80 h-80 pointer-events-none" />
        <div className="-bottom-32 left-1/4 absolute bg-fuchsia-500/30 blur-3xl rounded-full w-72 h-72 pointer-events-none" />
        <div className="relative mx-auto max-w-5xl">
          <h1 className="font-extrabold text-white text-4xl sm:text-5xl tracking-tight">
            Create{" "}
            <span className="bg-clip-text bg-gradient-to-r from-fuchsia-300 via-pink-300 to-orange-200 text-transparent">
              QR Invitation
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-purple-100/90 text-lg">
            Event ki details bharo, guest ke liye apna QR invitation taiyaar karo.
          </p>
        </div>
      </header>

      <main className="relative gap-6 grid md:grid-cols-2 mx-auto -mt-16 px-5 pb-20 max-w-5xl">
        {/* ---- Form card ---- */}
        <form
          onSubmit={generate}
          className="bg-white shadow-2xl shadow-purple-900/10 p-6 sm:p-8 rounded-3xl ring-1 ring-slate-100"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="event" className={label}>Event name</label>
              <input
                id="event"
                className={input}
                name="event"
                placeholder="Event name"
                value={form.event}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="guest" className={label}>Guest name</label>
              <input
                id="guest"
                className={input}
                name="guest"
                placeholder="Guest name"
                value={form.guest}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="date" className={label}>Date and time</label>
              <input
                id="date"
                className={input}
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="venue" className={label}>Venue</label>
              <input
                id="venue"
                className={input}
                name="venue"
                placeholder="Venue"
                value={form.venue}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button className="flex justify-center items-center gap-2 bg-gradient-to-r from-sky-500 hover:from-sky-600 to-blue-600 hover:to-blue-700 shadow-blue-500/30 shadow-lg hover:shadow-xl mt-7 py-3.5 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 w-full font-semibold text-white transition">
            Generate QR
            <span aria-hidden="true">→</span>
          </button>
        </form>

        {/* ---- Invitation / QR card (sunset theme) ---- */}
        <div className="relative flex flex-col justify-center items-center bg-gradient-to-br from-indigo-950 via-purple-800 to-pink-600 shadow-2xl shadow-purple-900/20 p-6 sm:p-8 rounded-3xl overflow-hidden text-white text-center">
          <div className="-top-16 -right-16 absolute bg-orange-400/30 blur-3xl rounded-full w-56 h-56 pointer-events-none" />
          <div className="-bottom-20 -left-10 absolute bg-fuchsia-500/30 blur-3xl rounded-full w-56 h-56 pointer-events-none" />

          {/* QR tabhi dikhega jab link ban jaye */}
          {link ? (
            <div className="relative flex flex-col items-center w-full">
              <p className="text-purple-200 text-sm">Invitation for</p>
              <p className="mt-1 max-w-full font-extrabold text-2xl truncate">
                {form.guest}
              </p>
              <p className="max-w-full text-purple-100 truncate">{form.event}</p>

              <div
                ref={qrRef}
                className="flex justify-center bg-white shadow-black/20 shadow-xl mt-6 p-3 rounded-3xl"
              >
                <QRCodeCanvas value={link} size={200} level="M" includeMargin />
              </div>

              <button
                onClick={download}
                className="bg-white/10 hover:bg-white/20 backdrop-blur mt-6 px-6 py-3 border border-white/30 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 font-semibold text-white transition"
              >
                Download QR
              </button>
            </div>
          ) : (
            <div className="relative py-10">
              <div className="flex justify-center items-center bg-white/10 backdrop-blur mx-auto border-2 border-white/40 border-dashed rounded-3xl w-44 h-44 text-purple-100 text-sm">
                QR yahan dikhega
              </div>
              <p className="mt-5 text-purple-100">
                Form bharo aur Generate QR dabao.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
