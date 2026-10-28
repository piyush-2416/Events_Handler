const express = require("express");
const router = express.Router();
const pool = require("../db");

const COLUMNS = `id, name, slug, category, description, city, state,
  contact_person, contact_phone, contact_email,
  starting_price, price_unit, experience_years, rating, total_reviews,
  services, cover_image, is_verified`;

// GET /api/vendors
router.get("/", async (req, res) => {
  try {
    const { category, city, verified } = req.query;

    let query = `SELECT ${COLUMNS} FROM vendors WHERE is_active = TRUE`;
    const values = [];

    if (category) {
      values.push(category);
      query += ` AND LOWER(category) = LOWER($${values.length})`;
    }
    if (city) {
      values.push(city);
      query += ` AND LOWER(city) = LOWER($${values.length})`;
    }
    if (verified === "true") query += " AND is_verified = TRUE";

    query += " ORDER BY rating DESC, total_reviews DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/vendors/:idOrSlug (id ya slug dono chalenge)
router.get("/:idOrSlug", async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const isNumeric = /^\d+$/.test(idOrSlug);

    const result = await pool.query(
      `SELECT * FROM vendors
       WHERE ${isNumeric ? "id" : "slug"} = $1 AND is_active = TRUE`,
      [isNumeric ? Number(idOrSlug) : idOrSlug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
