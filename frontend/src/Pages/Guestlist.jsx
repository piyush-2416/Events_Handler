import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

const STORAGE_KEY = "eventora_guestlist";

const DEFAULT_MSG =
  "Namaste! Aap hamare event mein invited hain. Aana zaroor, confirm karke bata dena.";

// "+91 98765-43210", "09876543210" -> "9876543210" (invalid ho to null)
const cleanPhone = (raw) => {
  const digits = String(raw ?? "").replace(/\D/g, "");
  const last10 = digits.slice(-10);
  return /^[6-9]\d{9}$/.test(last10) ? last10 : null;
};

// CSV ke header ka naam kuch bhi ho (Name / Full Name, Phone / Mobile / Number...)
const pick = (row, keys) => {
  for (const k of Object.keys(row)) {
    const key = k.trim().toLowerCase();
    if (keys.some((x) => key.includes(x))) return row[k];
  }
  return "";
};

const STATUS_LABEL = { pending: "Pending", yes: "Aayega", no: "Nahi aayega" };

// Refresh par list na ude, isliye sirf is browser mein save hoti hai (server par nahi)
const loadSaved = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export default function Guestlist() {
  const [guests, setGuests] = useState(loadSaved);
  const [message, setMessage] = useState(DEFAULT_MSG);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    } catch {
      /* storage na chale to bhi page kaam karta rahe */
    }
  }, [guests]);

  // ---- CSV upload ----
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // same file dobara chun sako
    if (!file) return;
    setError("");
    setNotice("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const seen = new Set(guests.map((g) => g.phone));
        const added = [];
        let invalid = 0;
        let duplicates = 0;

        for (const row of res.data) {
          const name = String(pick(row, ["name", "naam"])).trim();
          const phone = cleanPhone(pick(row, ["phone", "mobile", "number", "contact"]));
          if (!name || !phone) {
            invalid++;
            continue;
          }
          if (seen.has(phone)) {
            duplicates++;
            continue;
          }
          seen.add(phone);
          added.push({ id: crypto.randomUUID(), name, phone, status: "pending" });
        }

        if (added.length === 0) {
          setError(
            "Koi naya valid guest nahi mila. Columns ke naam 'name' aur 'phone' rakho."
          );
          return;
        }

        setGuests((g) => [...g, ...added]);
        setNotice(
          `${added.length} guests add hue` +
            (duplicates ? `, ${duplicates} pehle se the` : "") +
            (invalid ? `, ${invalid} rows galat ya khali number ki wajah se skip hui` : "") +
            "."
        );
      },
      error: () => setError("File padh nahi paye. Sahi CSV upload karo."),
    });
  };

  const changeStatus = (id, status) =>
    setGuests((g) => g.map((x) => (x.id === id ? { ...x, status } : x)));

  const removeGuest = (id) => setGuests((g) => g.filter((x) => x.id !== id));

  const clearAll = () => {
    if (!window.confirm("Poori guest list hata dein? Ye wapas nahi aayegi.")) return;
    setGuests([]);
    setNotice("");
  };

  const downloadSample = () => {
    const csv = "name,phone\nRahul Sharma,9876543210\nPriya Verma,+91 98765 43211\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "guests-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---- counts + filtered list ----
  const counts = useMemo(() => {
    const c = { total: guests.length, yes: 0, no: 0, pending: 0 };
    guests.forEach((g) => c[g.status]++);
    return c;
  }, [guests]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guests.filter(
      (g) =>
        (filter === "all" || g.status === filter) &&
        (!q || g.name.toLowerCase().includes(q) || g.phone.includes(q))
    );
  }, [guests, search, filter]);

  return (
    <div className="gl-page">
      <style>{css}</style>

      <h1 className="gl-title">Guest List</h1>
      <p className="gl-sub">
        Apni CSV file upload karo, phir har guest ko call, SMS ya WhatsApp karo.
      </p>

      <div className="gl-card">
        <div className="gl-upload-row">
          <label className="gl-btn">
            CSV upload karo
            <input type="file" accept=".csv,text/csv" onChange={handleFile} hidden />
          </label>
          <button type="button" className="gl-link" onClick={downloadSample}>
            Sample CSV download karo
          </button>
        </div>
        <p className="gl-hint">
          File mein do columns rakho: <b>name</b> aur <b>phone</b>. Numbers kisi bhi
          format mein ho sakte hain (+91, spaces, dashes). Aapki list sirf aapke
          browser mein rehti hai, kisi server par nahi jaati.
        </p>
      </div>

      {error && <div className="gl-error">{error}</div>}
      {notice && <div className="gl-notice">{notice}</div>}

      <div className="gl-counts">
        <div><strong>{counts.total}</strong><span>Total</span></div>
        <div><strong>{counts.yes}</strong><span>Aayenge</span></div>
        <div><strong>{counts.no}</strong><span>Nahi aayenge</span></div>
        <div><strong>{counts.pending}</strong><span>Pending</span></div>
      </div>

      <label className="gl-field">
        <span>WhatsApp message (sabko yahi jayega)</span>
        <textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>

      <div className="gl-toolbar">
        <input
          type="search"
          placeholder="Naam ya number dhundo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Sab</option>
          <option value="pending">Pending</option>
          <option value="yes">Aayenge</option>
          <option value="no">Nahi aayenge</option>
        </select>
        {guests.length > 0 && (
          <button className="gl-btn gl-danger" onClick={clearAll}>
            Poori list hatao
          </button>
        )}
      </div>

      {guests.length === 0 ? (
        <p className="gl-empty">Abhi koi guest nahi hai. Upar se CSV upload karo.</p>
      ) : visible.length === 0 ? (
        <p className="gl-empty">Is search ya filter se koi guest nahi mila.</p>
      ) : (
        <ul className="gl-list">
          {visible.map((g) => (
            <li key={g.id} className="gl-row">
              <div className="gl-who">
                <b>{g.name}</b>
                <span>{g.phone}</span>
              </div>

              <div className="gl-contact">
                <a className="gl-act" href={`tel:+91${g.phone}`}>Call</a>
                <a className="gl-act" href={`sms:+91${g.phone}`}>SMS</a>
                <a
                  className="gl-act gl-wa"
                  href={`https://wa.me/91${g.phone}?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </div>

              <select
                className={`gl-status gl-${g.status}`}
                value={g.status}
                onChange={(e) => changeStatus(g.id, e.target.value)}
                aria-label={`${g.name} ka status`}
              >
                {Object.entries(STATUS_LABEL).map(([v, label]) => (
                  <option key={v} value={v}>{label}</option>
                ))}
              </select>

              <button
                className="gl-x"
                onClick={() => removeGuest(g.id)}
                aria-label={`${g.name} ko hatao`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const css = `
.gl-page { max-width: 820px; margin: 0 auto; padding: 32px 20px 64px; text-align: left;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #1a2233; }
.gl-title { font-size: 2rem; margin: 0 0 6px; }
.gl-sub { margin: 0 0 20px; color: #5b6578; }

.gl-card { padding: 18px; border: 1px solid #d9e1f0; border-radius: 14px; background: #f6f9ff; }
.gl-upload-row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.gl-hint { margin: 10px 0 0; font-size: 0.9rem; color: #5b6578; }
.gl-link { background: none; border: 0; color: #1d6fe0; cursor: pointer; text-decoration: underline; font-size: 0.95rem; }

.gl-btn { display: inline-block; padding: 10px 16px; border: 0; border-radius: 10px; background: #1d6fe0;
  color: #fff; font-size: 0.95rem; font-weight: 600; cursor: pointer; }
.gl-btn:hover { background: #155bc0; }
.gl-danger { background: #fff; color: #a12626; border: 1px solid #e3b4b4; }
.gl-danger:hover { background: #fdecec; }

.gl-error { margin-top: 14px; padding: 12px 14px; border-radius: 8px; background: #fdecec; color: #a12626; }
.gl-notice { margin-top: 14px; padding: 12px 14px; border-radius: 8px; background: #e8f6ec; color: #1d6b3a; }

.gl-counts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0; }
.gl-counts div { padding: 12px; border: 1px solid #e3e8f2; border-radius: 10px; text-align: center; }
.gl-counts strong { display: block; font-size: 1.5rem; }
.gl-counts span { font-size: 0.85rem; color: #5b6578; }

.gl-field { display: flex; flex-direction: column; gap: 6px; font-size: 0.9rem; margin-bottom: 14px; }
.gl-field span { font-weight: 600; }
.gl-field textarea, .gl-toolbar input, .gl-toolbar select {
  padding: 10px 12px; border: 1px solid #c3cde0; border-radius: 8px; font-size: 1rem; background: #fff; font-family: inherit; }
.gl-toolbar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.gl-toolbar input { flex: 1; min-width: 180px; }

.gl-list { list-style: none; margin: 0; padding: 0; }
.gl-row { display: grid; grid-template-columns: 1.4fr auto 130px 32px; gap: 12px; align-items: center;
  padding: 12px 0; border-bottom: 1px solid #e3e8f2; }
.gl-who { display: flex; flex-direction: column; }
.gl-who span { font-size: 0.9rem; color: #5b6578; }
.gl-contact { display: flex; gap: 6px; }
.gl-act { padding: 7px 12px; border: 1px solid #c3cde0; border-radius: 8px; background: #fff;
  color: #1a2233; text-decoration: none; font-size: 0.9rem; }
.gl-act:hover { background: #eef2fa; }
.gl-wa { background: #1faa59; border-color: #1faa59; color: #fff; }
.gl-wa:hover { background: #178a47; }
.gl-status { padding: 8px; border-radius: 8px; border: 1px solid #c3cde0; font-size: 0.9rem; background: #fff; }
.gl-yes { background: #e8f6ec; border-color: #9fd3b0; }
.gl-no { background: #fdecec; border-color: #e3b4b4; }
.gl-x { border: 0; background: none; color: #8a93a6; font-size: 1rem; cursor: pointer; }
.gl-x:hover { color: #a12626; }
.gl-empty { padding: 24px 0; color: #5b6578; text-align: center; }

.gl-btn:focus-visible, .gl-act:focus-visible, .gl-status:focus-visible, .gl-x:focus-visible,
.gl-link:focus-visible, .gl-toolbar input:focus-visible, .gl-toolbar select:focus-visible,
.gl-field textarea:focus-visible { outline: 2px solid #1d6fe0; outline-offset: 2px; }

@media (max-width: 640px) {
  .gl-counts { grid-template-columns: repeat(2, 1fr); }
  .gl-row { grid-template-columns: 1fr 32px; }
  .gl-contact, .gl-status { grid-column: 1 / -1; }
}
`;
