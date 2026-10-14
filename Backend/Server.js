const express = require("express");
const cors = require("cors");
require("dotenv").config();

const categoriesRoute = require("./routes/categories");
const eventsRoute = require("./routes/events");

const app = express();

// ---------- Middlewares ----------
app.use(cors({ origin: "http://localhost:5173" })); // Vite frontend ka URL
app.use(express.json());

// ---------- Routes ----------
app.use("/api/categories", categoriesRoute);
app.use("/api/events", eventsRoute);

// Health check
app.get("/", (req, res) => res.send("EventHandler API running"));

// Unknown route par 404
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));