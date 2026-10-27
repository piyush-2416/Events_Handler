// solverRoutes.js  (CommonJS: require / module.exports)
// Jagah: Backend\routes\solverRoutes.js
const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

let ai; // pehli request par bante hain, taaki .env pehle load ho chuka ho
const getAI = () => (ai ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }));

const SOLVER_PROMPT = `
Tum Eventora ke "Event Problem Solver" ho. Indian events (shaadi, mehndi, haldi,
sangeet, birthday, corporate, party) ki last-minute aur planning problems ke
practical solution dete ho.

Rules:
- Jawab Hinglish mein, chhote aur seedhe steps mein.
- Sirf wahi sujhav do jo sach mein kiye ja sakein; koi vendor ka naam, phone
  number ya exact price khud se mat banao (sirf andaza batao, "approx" likho).
- Steps ka order aisa ho ki pehla step sabse zaroori ho.
- Agar problem mein chot, bimari, aag, gas leak, hinsa, ya jaan ka khatra ho:
  "emergency": true karo, aur pehle step mein 112 (police/fire) ya 108
  (ambulance) par call karne ko likho. Medical ya legal salah mat do.
- Sirf JSON return karo, koi extra text ya backticks nahi.

Format:
{
  "emergency": boolean,
  "severity": "low" | "medium" | "high",
  "summary": string,
  "steps": [{ "title": string, "detail": string }],
  "backupPlan": string,
  "dontForget": [string]
}
`;

// Gemini fail ho to bhi page na toote
const FALLBACK = {
  emergency: false,
  severity: "medium",
  summary:
    "AI abhi available nahi hai, isliye ye general checklist hai jo zyadatar event problems mein kaam aati hai.",
  steps: [
    { title: "Problem likho", detail: "Kya, kab aur kis vendor ya cheez se related hai, ye saaf likh lo." },
    { title: "Sambandhit vendor se turant baat karo", detail: "Phone par baat karke WhatsApp par likhit confirmation lo." },
    { title: "Backup option dhundo", detail: "Kam se kam 2 alternatives ki list banao aur pehle se baat kar lo." },
    { title: "Guests ko update do", detail: "Agar timing ya venue badle to sabko ek saath WhatsApp par batao." },
  ],
  backupPlan: "Agar main plan na bane to simple aur chhota version chalao: kam items, kam guests, par time par.",
  dontForget: ["Sabhi vendors ke numbers ek jagah rakho", "Advance payment ki receipt sambhaal ke rakho"],
  fallback: true,
};

// Simple rate limit: free quota bachane ke liye (har IP se 10 request / minute)
const hits = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const recent = (hits.get(req.ip) || []).filter((t) => now - t < 60_000);
  if (recent.length >= 10) {
    return res.status(429).json({ error: "Bahut zyada requests. Ek minute baad try karo." });
  }
  recent.push(now);
  hits.set(req.ip, recent);
  next();
}

// Gemini ka output kabhi ```json ke saath aa jaata hai, usko saaf karo
function parseJSON(text) {
  const clean = String(text).replace(/```json|```/g, "").trim();
  const o = JSON.parse(clean);
  if (!o || typeof o.summary !== "string" || !Array.isArray(o.steps)) {
    throw new Error("Galat format");
  }
  return {
    emergency: !!o.emergency,
    severity: ["low", "medium", "high"].includes(o.severity) ? o.severity : "medium",
    summary: o.summary,
    steps: o.steps
      .filter((s) => s && s.title)
      .slice(0, 10)
      .map((s) => ({ title: String(s.title), detail: String(s.detail ?? "") })),
    backupPlan: String(o.backupPlan ?? ""),
    dontForget: Array.isArray(o.dontForget) ? o.dontForget.slice(0, 8).map(String) : [],
  };
}

// POST /api/solve  body: { eventType, problem, guests?, budget? }
router.post("/", rateLimit, async (req, res) => {
  const eventType = String(req.body.eventType ?? "").trim().slice(0, 50);
  const problem = String(req.body.problem ?? "").trim();
  const guests = Number(req.body.guests) || null;
  const budget = Number(req.body.budget) || null;

  if (problem.length < 10 || problem.length > 500) {
    return res.status(400).json({ error: "Problem 10 se 500 characters ke beech likho." });
  }

  const input =
    `Event type: ${eventType || "Nahi bataya"}\n` +
    (guests ? `Guests: ${guests}\n` : "") +
    (budget ? `Budget: ₹${budget}\n` : "") +
    `Problem: ${problem}`;

  try {
    const response = await getAI().models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      contents: input,
      config: {
        systemInstruction: SOLVER_PROMPT,
        responseMimeType: "application/json",
      },
    });
    res.json(parseJSON(response.text));
  } catch (err) {
    console.error("Solver error:", err.message);
    res.json(FALLBACK); // 200 + fallback flag, taaki frontend ek jaisa chale
  }
});

module.exports = router;
