const express = require("express");
const router = express.Router();
const pool = require("../db"); // wahi eventDB ka pool, packages table usi DB me hai

const COLUMNS = `id, name, slug, event_type, tier, description,
  price, price_per_guest, min_guests, max_guests, duration_hours,
  inclusions, cover_image, is_popular`;

// GET /api/packages
// Optional filters:  ?event_type=Wedding   ?tier=Premium   ?popular=true
router.get("/", async (req, res) => {
  try {
    const { event_type, tier, popular } = req.query;

    let query = `SELECT ${COLUMNS} FROM packages WHERE is_active = TRUE`;
    const values = [];

    if (event_type) {
      values.push(event_type);
      query += ` AND LOWER(event_type) = LOWER($${values.length})`;
    }
    if (tier) {
      values.push(tier);
      query += ` AND LOWER(tier) = LOWER($${values.length})`;
    }
    if (popular === "true") query += " AND is_popular = TRUE";

    query += " ORDER BY is_popular DESC, price ASC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/packages/:slug  -> ek package ki full detail
router.get("/:slug", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM packages WHERE slug = $1 AND is_active = TRUE",
      [req.params.slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
