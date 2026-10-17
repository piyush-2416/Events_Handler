require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

// ---------- DB (pool) ----------
// IMPORTANT: Backend\routes\events.js ke top par dekho ki wahan database
// kaise import ho raha hai, aur wahi yahan likho (bas "../" ki jagah "./").
//   events.js mein:  const pool = require("../db");        -> yahan: require("./db")
//   events.js mein:  const { pool } = require("../config/db"); -> yahan: const { pool } = require("./config/db")
const pool = require("./db");

// ---------- Routes ----------
const categoriesRoute = require("./routes/categories");
const eventsRoute = require("./routes/events");
const vendorsRoute = require("./routes/vendors");
const venuesRoute = require("./routes/venues");
const packagesRoute = require("./routes/packages");
const guestRoutes = require("./routes/guestRoutes"); // file Backend\routes\ mein rakho

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
Tum Eventora ke event budget planner ho. Indian events (shaadi, mehndi, haldi,
sangeet, birthday, corporate) ka budget plan banate ho.
Rules:
- User ke budget se zyada total kabhi mat do.
- Sirf JSON return karo, koi extra text nahi.
- Format: {"total": number, "breakdown": [{"category": string, "amount": number, "tip": string}]}
- Categories: Venue, Catering, Decor, Photography, Entertainment, Miscellaneous
`;

// ---------- Middlewares ----------
app.use(cors({ origin: "http://localhost:5173" })); // Vite frontend ka URL
app.use(express.json());

// ---------- Budget planner (Gemini) ----------
app.post("/api/plan", async (req, res) => {
  try {
    const { eventType, budget, guests } = req.body;

    const response = await ai.models.generateContent({
      // Model ka naam badalta rehta hai, isliye .env mein GEMINI_MODEL rakh sakte ho
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      contents: `Event: ${eventType}, Budget: ₹${budget}, Guests: ${guests}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Plan generate nahi ho paya" });
  }
});

// ---------- API routes ----------
app.use("/api", guestRoutes(pool)); // guest list (/api/events/:eventId/guests, /api/guests/:id)
app.use("/api/categories", categoriesRoute);
app.use("/api/events", eventsRoute);
app.use("/api/vendors", vendorsRoute);
app.use("/api/venues", venuesRoute);
app.use("/api/packages", packagesRoute);

// Health check
app.get("/", (req, res) => res.send("EventHandler API running"));

// Unknown route par 404 (HAMESHA saare routes ke baad)
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
