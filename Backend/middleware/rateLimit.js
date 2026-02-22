import rateLimit from "express-rate-limit";

/* ---------- strict (auth) ---------- */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: {
    message: "Too many login attempts. Try later."
  },
  standardHeaders: true,
  legacyHeaders: false
});


/* ---------- submissions ---------- */
export const submissionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 200,
  message: {
    message: "Too many submissions. Slow down."
  }
});


/* ---------- general API ---------- */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300
});
