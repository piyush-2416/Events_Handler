const jwt = require("jsonwebtoken");

// Token verify karne wala middleware - protected routes pe lagana hai
function verifyToken(req, res, next) {
  // Header format: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Login required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role } aage routes me use kar sakte ho
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalid ya expire ho gaya" });
  }
}

// Role check karne wala middleware (verifyToken ke BAAD lagana hai)
// Use: router.post("/", verifyToken, requireRole("admin", "vendor"), handler)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Aapko is kaam ki permission nahi hai" });
    }
    next();
  };
}

module.exports = verifyToken; // purana require("../middleware/auth") waise hi chalega
module.exports.requireRole = requireRole;
