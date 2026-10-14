const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/categories
// Saari active categories (display_order ke hisaab se)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, slug, display_order, image_url, description, starting_price
       FROM event_categories
       WHERE is_active = TRUE
       ORDER BY display_order`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/categories/:slug/events
// Kisi ek category ke saare active events
router.get("/:slug/events", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*
       FROM events e
       JOIN event_categories c ON c.id = e.category_id
       WHERE c.slug = $1 AND e.is_active = TRUE
       ORDER BY e.created_at DESC`,
      [req.params.slug]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;