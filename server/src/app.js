const express  = require("express");
const cors     = require("cors");
const helmet   = require("helmet");
const morgan   = require("morgan");
const { generalLimiter, errorHandler } = require("./middleware/index");

// Route imports
const authRoutes        = require("./routes/auth.routes");
const eventRoutes       = require("./routes/event.routes");
const { contactRouter, subscriberRouter, galleryRouter, adminRouter } = require("./routes/other.routes");

const app = express();

// ── Security & Parsing ────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logging (dev only) ────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Rate limiting ─────────────────────────────────────
app.use("/api", generalLimiter);

// ── Routes ────────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/events",      eventRoutes);
app.use("/api/contact",     contactRouter);
app.use("/api/subscribe",   subscriberRouter);
app.use("/api/gallery",     galleryRouter);
app.use("/api/admin",       adminRouter);

// ── Health check ──────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "EventSphere API is running 🚀" });
});

// ── 404 handler ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ──────────────────────────────
app.use(errorHandler);

module.exports = app;