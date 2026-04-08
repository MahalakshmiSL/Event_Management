// ════════════════════════════════════════════════════
//  routes/auth.routes.js
// ════════════════════════════════════════════════════
const express = require("express");
const router  = express.Router();
const { register, login, getMe, toggleSaveEvent } = require("../controllers/auth.controller");
const { protect, validate, schemas, authLimiter } = require("../middleware/index");
const User = require("../models/User.model"); // add this at the top
router.get("/test", (req, res) => {
  res.json({ message: "Auth working" });
});
router.get("/clear-users", async (req, res) => {
  await User.deleteMany({});
  res.json({ message: "All users cleared" });
});
router.post("/register", register);  // ← was missing
router.post("/login",    login);     // ← was missing
router.get( "/me",       protect, getMe);
router.put( "/save-event/:eventId",  protect, toggleSaveEvent);

console.log("Auth routes loaded");
module.exports = router;