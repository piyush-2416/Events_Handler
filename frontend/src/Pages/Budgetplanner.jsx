import { useState } from "react";

const API_URL = "http://localhost:5000/api/plan";

const EVENT_TYPES = [
  "Baby Shower",
  "Birthday",
  "Corporate",
  "Engagement",
  "Festival",
  "Haldi",
  "Mehndi",
  "Party",
  "Sangeet",
  "Wedding",
];

const formatINR = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export default function Budgetplanner() {
  const [eventType, setEventType] = useState("Mehndi");
  const [budget, setBudget] = useState(150000);
  const [guests, setGuests] = useState(100);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setPlan(null);

    if (!budget || budget <= 0 || !guests || guests <= 0) {
      setError("Budget aur guests dono 0 se zyada hone chahiye.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          budget: Number(budget),
          guests: Number(guests),
        }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setPlan(data);
    } catch (err) {
      console.error(err);
      setError(
        "Plan nahi ban paya. Check karo ki backend (port 5000) chal raha hai."
      );
    } finally {
      setLoading(false);
    }
  };

  const total = plan?.total || 0;

  return (
    <div className="bp-page">
      <style>{css}</style>

      <h1 className="bp-title">Budget Planner</h1>
      <p className="bp-sub">
        Event type, budget aur guests batao, hum breakdown bana denge.
      </p>

      <div className="bp-form">
        <label className="bp-field">
          <span>Event type</span>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="bp-field">
          <span>Budget (₹)</span>
          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </label>

        <label className="bp-field">
          <span>Guests</span>
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </label>

        <button
          type="button"
          className="bp-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Plan ban raha hai..." : "Plan banao"}
        </button>
      </div>

      {error && <div className="bp-error">{error}</div>}

      {plan && (
        <div className="bp-result">
          <div className="bp-total">
            <span>Total budget</span>
            <strong>{formatINR(plan.total)}</strong>
          </div>

          <ul className="bp-list">
            {plan.breakdown?.map((item) => {
              const pct = total ? Math.round((item.amount / total) * 100) : 0;
              return (
                <li key={item.category} className="bp-item">
                  <div className="bp-row">
                    <span className="bp-cat">{item.category}</span>
                    <span className="bp-amt">
                      {formatINR(item.amount)} ({pct}%)
                    </span>
                  </div>
                  <div className="bp-bar">
                    <div className="bp-fill" style={{ width: `${pct}%` }} />
                  </div>
                  {item.tip && <p className="bp-tip">{item.tip}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

const css = `
.bp-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 20px 64px;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  color: #1a2233;
}
.bp-title { font-size: 2rem; margin: 0 0 6px; }
.bp-sub { margin: 0 0 24px; color: #5b6578; }

.bp-form {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 20px;
  border: 1px solid #d9e1f0;
  border-radius: 14px;
  background: #f6f9ff;
}
.bp-field { display: flex; flex-direction: column; gap: 6px; font-size: 0.9rem; }
.bp-field span { font-weight: 600; }
.bp-field input,
.bp-field select {
  padding: 10px 12px;
  border: 1px solid #c3cde0;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
}
.bp-field input:focus,
.bp-field select:focus,
.bp-btn:focus-visible {
  outline: 2px solid #1d6fe0;
  outline-offset: 2px;
}
.bp-btn {
  grid-column: 1 / -1;
  padding: 12px;
  border: 0;
  border-radius: 10px;
  background: #1d6fe0;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
.bp-btn:hover:not(:disabled) { background: #155bc0; }
.bp-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.bp-error {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fdecec;
  color: #a12626;
}

.bp-result { margin-top: 28px; }
.bp-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 12px;
  margin-bottom: 8px;
  border-bottom: 2px solid #1a2233;
}
.bp-total strong { font-size: 1.6rem; }

.bp-list { list-style: none; margin: 0; padding: 0; }
.bp-item { padding: 14px 0; border-bottom: 1px solid #e3e8f2; }
.bp-row { display: flex; justify-content: space-between; gap: 12px; }
.bp-cat { font-weight: 600; }
.bp-amt { color: #34405a; }
.bp-bar { height: 8px; margin: 8px 0; border-radius: 99px; background: #e3e8f2; overflow: hidden; }
.bp-fill { height: 100%; background: #1d6fe0; border-radius: 99px; }
.bp-tip { margin: 0; font-size: 0.9rem; color: #5b6578; }

@media (max-width: 600px) {
  .bp-form { grid-template-columns: 1fr; }
}
`;
