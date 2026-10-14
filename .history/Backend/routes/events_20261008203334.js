const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/events
// Optional filters:  ?featured=true   ?category=wedding
router.get("/", async (req, res) => {
  try {
    const { featured, category } = req.query;

    let query = `
      SELECT e.id, e.title, e.slug, e.short_description, e.image_url,
             e.base_price, e.price_per_guest, e.min_guests, e.max_guests,
             e.duration_hours, e.is_featured,
             c.name AS category_name, c.slug AS category_slug
      FROM events e
      JOIN event_categories c ON c.id = e.category_id
      WHERE e.is_active = TRUE`;
    const values = [];

    // Sirf featured events
    if (featured === "true") query += " AND e.is_featured = TRUE";

    // Category slug se filter (parameterized, SQL injection safe)
    if (category) {
      values.push(category);
      query += ` AND c.slug = $${values.length}`;
    }

    query += " ORDER BY e.created_at DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/events/:slug
// Ek event ki full detail (inclusions, exclusions, terms sab)
router.get("/:slug", async (req, res) => {
  try {
    // view_count +1 karke row wapas lo
    const result = await pool.query(
      `UPDATE events
       SET view_count = COALESCE(view_count, 0) + 1
       WHERE slug = $1 AND is_active = TRUE
       RETURNING *`,
      [req.params.slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(result.rows[0]); // inclusions/exclusions JS array ban ke aate hain
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;