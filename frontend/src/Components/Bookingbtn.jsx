import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const pad = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const VARIANTS = {
  primary:
    "flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:bg-emerald-800",
  outline:
    "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-slate-800 ring-1 ring-slate-300 transition hover:bg-slate-900 hover:text-white",
  compact:
    "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700",
};

/*
  Use:
  <BookingButton itemType="event" itemId={event.id} itemTitle={event.title} defaultGuests={guests} />
  itemType: "event" | "vendor" | "venue" | "package"
  variant:  "primary" | "outline" | "compact"
*/
export default function Bookingbtn({
  itemType,
  itemId,
  itemTitle,
  defaultGuests,
  variant = "primary",
  label = "Book now",
}) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: "", guests: "", note: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);
  const dateRef = useRef(null);

  const close = () => {
    if (busy) return;
    setOpen(false);
    setDone(null);
    setError("");
  };

  const openModal = () => {
    if (loading) return;
    if (!user) {
      // login ke baad wapas isi page par aane ke liye location bhej rahe hain
      navigate("/login", { state: { from: location } });
      return;
    }
    setForm({
      date: "",
      guests: defaultGuests ? String(defaultGuests) : "",
      note: "",
    });
    setError("");
    setDone(null);
    setOpen(true);
  };

  // Esc se band + peeche ka scroll lock
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) {
        setOpen(false);
        setDone(null);
        setError("");
      }
    }; 
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dateRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, busy]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.date) return setError("Please choose a booking date");
    if (form.date < todayStr()) return setError("Past date cannot be booked");

    setBusy(true);
    try {
      const res = await api.post("/bookings", {
        item_type: itemType,
        item_id: Number(itemId),
        booking_date: form.date,
        guests: form.guests ? Number(form.guests) : null,
        note: form.note.trim() || null,
      });
      setDone(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError(err.response?.data?.error || "Booking failed, please try again");
      }
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none focus:border-emerald-600";

  return (
    <>
      <button type="button" onClick={openModal} className={VARIANTS[variant] || VARIANTS.primary}>
        📅 {label}
      </button>

      {open && (
        <div
          onClick={close}
          className="z-[60] fixed inset-0 flex justify-center items-center bg-slate-900/50 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bk-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white shadow-2xl p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto text-slate-900 text-left [color-scheme:light]"
          >
            {done ? (
              <div className="text-center">
                <div className="flex justify-center items-center bg-emerald-100 mx-auto rounded-full w-14 h-14 text-2xl">
                  ✅
                </div>
                <h3 id="bk-title" className="mt-4 font-bold text-xl">
                  Booking request sent
                </h3>
                <p className="mt-2 text-slate-700 text-sm">
                  <b>{done.item_title}</b>
                  <br />
                  Date: {done.booking_date}
                  {done.guests ? ` · ${done.guests} guests` : ""}
                </p>
                <p className="mt-1 text-slate-500 text-xs">Status: pending</p>
                <div className="gap-3 grid mt-6">
                  <Link
                    to="/bookings"
                    className="bg-emerald-100 hover:bg-emerald-100 py-3 rounded-xl font-semibold text-white text-sm"
                  >
                    View my bookings
                  </Link>
                  <button
                    type="button"
                    onClick={close}
                    className="hover:bg-slate-50 py-3 rounded-xl ring-1 ring-slate-300 font-semibold text-slate-700 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h3 id="bk-title" className="font-bold text-xl">
                  Book this {itemType}
                </h3>
                {itemTitle && <p className="mt-1 text-slate-600 text-sm">{itemTitle}</p>}

                <div className="space-y-4 mt-5">
                  <div>
                    <label htmlFor="bk-date" className="block mb-1 font-medium text-sm">
                      Booking date
                    </label>
                    <input
                      id="bk-date"
                      ref={dateRef}
                      type="date"
                      min={todayStr()}
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="bk-guests" className="block mb-1 font-medium text-sm">
                      Guests <span className="font-normal text-slate-500">(optional)</span>
                    </label>
                    <input
                      id="bk-guests"
                      type="number"
                      min="1"
                      value={form.guests}
                      onChange={(e) => setForm({ ...form, guests: e.target.value })}
                      placeholder="e.g. 150"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="bk-note" className="block mb-1 font-medium text-sm">
                      Note <span className="font-normal text-slate-500">(optional)</span>
                    </label>
                    <textarea
                      id="bk-note"
                      rows={3}
                      maxLength={500}
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="Anything we should know?"
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {error && (
                    <p role="alert" className="bg-red-50 p-3 rounded-lg text-red-700 text-sm">
                      ⚠️ {error}
                    </p>
                  )}

                  <div className="gap-3 grid grid-cols-2 pt-1">
                    <button
                      type="button"
                      onClick={close}
                      disabled={busy}
                      className="hover:bg-slate-50 disabled:opacity-60 py-3 rounded-xl ring-1 ring-slate-300 font-semibold text-slate-700 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={busy}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 py-3 rounded-xl font-semibold text-white text-sm"
                    >
                      {busy ? "Booking..." : "Confirm booking"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}