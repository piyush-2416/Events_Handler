const express = require("express");
const router = express.Router();
const pool = require("../db"); // wahi eventDB ka pool, venues table usi DB me hai

const COLUMNS = `id, name, slug, description, address, city, state, pincode,
  latitude, longitude, capacity, contact_phone, contact_email,
  amenities, cover_image`;

// GET /api/venues
// Optional filters:  ?city=Noida   ?min_capacity=300
router.get("/", async (req, res) => {
  try {
    const { city, min_capacity } = req.query;

    let query = `SELECT ${COLUMNS} FROM venues WHERE is_active = TRUE`;
    const values = [];

    if (city) {
      values.push(city);
      query += ` AND LOWER(city) = LOWER($${values.length})`;
    }
    if (min_capacity && !Number.isNaN(Number(min_capacity))) {
      values.push(Number(min_capacity));
      query += ` AND capacity >= $${values.length}`;
    }

    query += " ORDER BY id";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/venues/:slug  -> ek venue ki full detail
router.get("/:slug", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM venues WHERE slug = $1 AND is_active = TRUE",
      [req.params.slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
