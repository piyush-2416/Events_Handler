const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const verifyToken = require("../middleware/auth");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

// Signup pe sirf ye roles allowed hain. "admin" kabhi yahan se nahi milega!
const SIGNUP_ROLES = ["user", "vendor"];

// Token me role bhi daal diya (7 din valid)
const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

// ---------- SIGNUP ----------
// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email aur password zaroori hain" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password kam se kam 6 characters ka hona chahiye" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Role whitelist: kuch galat ya "admin" bheja to bhi "user" hi banega
    const safeRole = SIGNUP_ROLES.includes(role) ? role : "user";

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name.trim(), cleanEmail, passwordHash, safeRole],
    );

    const user = result.rows[0];
    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    // 23505 = unique violation (email already exists)
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "Is email se account pehle se bana hai" });
    }
    console.error(err);
    res.status(500).json({ error: "Signup nahi ho paya" });
  }
});

// ---------- LOGIN ----------
// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email aur password daalo" });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email.trim().toLowerCase(),
    ]);

    const invalid = () =>
      res.status(401).json({ error: "Email ya password galat hai" });

    if (result.rows.length === 0) return invalid();

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return invalid();

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    res.json({ token: signToken(safeUser), user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login nahi ho paya" });
  }
});

// ---------- ME (logged-in user ki info) ----------
// GET /api/auth/me  (token chahiye)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.user.id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User nahi mila" });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- ALL USERS (sirf ADMIN) ----------
// GET /api/auth/users
router.get("/users", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC",
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Users load nahi ho paye" });
  }
});

module.exports = router;
