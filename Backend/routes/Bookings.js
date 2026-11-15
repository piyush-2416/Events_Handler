const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/auth");

// Har route ke liye login zaroori. user ki id HAMESHA token se aati hai (req.user.id),
// frontend ki body se kabhi nahi, isliye koi dusre ke naam par booking nahi kar sakta.
router.use(verifyToken);

// Kis type ke liye kaunsi table / columns. (Sirf yahi whitelist SQL me jaati hai.)
const ITEMS = {
  event: { table: "events", title: "title", image: "image_url", active: true },
  vendor: { table: "vendors", title: "name", image: "cover_image", active: true },
  venue: { table: "venues", title: "name", image: "cover_image", active: false },
  package: { table: "packages", title: "name", image: "cover_image", active: false },
};

// date ko text me hi rakho (pg DATE ko JS Date bana deta hai aur timezone se din badal jata hai)
const COLS = `id, item_type, item_id, item_title, item_image,
  to_char(booking_date, 'YYYY-MM-DD') AS booking_date,
  guests, note, status, created_at, updated_at`;

const pad = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// POST /api/bookings   body: { item_type, item_id, booking_date, guests?, note? }
router.post("/", async (req, res) => {
  try {
    const { item_type, item_id, booking_date, guests, note } = req.body || {};

    const cfg = ITEMS[item_type];
    if (!cfg) return res.status(400).json({ error: "Galat booking type" });

    const itemId = Number(item_id);
    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({ error: "Galat item id" });
    }

    if (
      typeof booking_date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(booking_date) ||
      Number.isNaN(Date.parse(booking_date))
    ) {
      return res.status(400).json({ error: "Sahi booking date chuno" });
    }
    if (booking_date < todayStr()) {
      return res.status(400).json({ error: "Past ki date book nahi ho sakti" });
    }

    let guestCount = null;
    if (guests !== undefined && guests !== null && guests !== "") {
      guestCount = Number(guests);
      if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 100000) {
        return res.status(400).json({ error: "Guests ki sankhya galat hai" });
      }
    }

    const cleanNote = typeof note === "string" ? note.trim().slice(0, 500) : "";

    // Item sach me hai ya nahi, aur uska naam / image lo
    const found = await pool.query(
      `SELECT ${cfg.title} AS title, ${cfg.image} AS image
       FROM ${cfg.table}
       WHERE id = $1 ${cfg.active ? "AND is_active = TRUE" : ""}`,
      [itemId]
    );
    if (found.rows.length === 0) {
      return res.status(404).json({ error: "Ye item ab available nahi hai" });
    }
    const { title, image } = found.rows[0];

    const result = await pool.query(
      `INSERT INTO bookings
         (user_id, item_type, item_id, item_title, item_image, booking_date, guests, note)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING ${COLS}`,
      [req.user.id, item_type, itemId, title, image || null, booking_date, guestCount, cleanNote || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      // unique index: same user, same item, same date, abhi active
      return res
        .status(409)
        .json({ error: "Aapne is date ke liye ye booking pehle se kar rakhi hai" });
    }
    if (err.code === "23503") {
      return res.status(400).json({ error: "User nahi mila, dobara login karo" });
    }
    console.error("POST /bookings:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/bookings/mine  -> SIRF logged-in user ki bookings
router.get("/mine", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${COLS}
       FROM bookings
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /bookings/mine:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/bookings/:id/cancel  -> sirf apni booking cancel ho sakti hai
router.patch("/:id/cancel", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Galat booking id" });
    }

    const result = await pool.query(
      `UPDATE bookings
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND status <> 'cancelled'
       RETURNING ${COLS}`,
      [id, req.user.id]
    );

    // Dusre ki booking ho ya hai hi nahi: dono par same jawab (kuch leak nahi hota)
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Booking nahi mili" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("PATCH /bookings/:id/cancel:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;