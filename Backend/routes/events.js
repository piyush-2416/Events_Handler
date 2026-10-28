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

    if (featured === "true") query += " AND e.is_featured = TRUE";

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

// GET /api/events/:idOrSlug
// /api/events/5            -> id se
// /api/events/royal-wedding -> slug se
router.get("/:idOrSlug", async (req, res) => {
  try {
    const param = req.params.idOrSlug;
    const isId = /^\d{1,9}$/.test(param); // sirf number ho to id maano

    const condition = isId ? "id = $1" : "slug = $1";
    const value = isId ? Number(param) : param;

    // view_count +1 karo aur category ka naam bhi saath lo
    const result = await pool.query(
      `WITH updated AS (
         UPDATE events
         SET view_count = COALESCE(view_count, 0) + 1
         WHERE ${condition} AND is_active = TRUE
         RETURNING *
       )
       SELECT u.*, c.name AS category_name, c.slug AS category_slug
       FROM updated u
       JOIN event_categories c ON c.id = u.category_id`,
      [value]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
