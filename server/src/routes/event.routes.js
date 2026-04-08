const express = require("express");
const router  = express.Router();
const {
  getEvents, getEvent, createEvent, updateEvent,
  deleteEvent, registerForEvent, cancelRegistration, getFeaturedEvent,
} = require("../controllers/event.controller");
const { protect, adminOnly, validate, schemas } = require("../middleware/index");
const { uploadEventImage } = require("../config/cloudinary");

router.get( "/featured",           getFeaturedEvent);
router.get( "/",                   getEvents);
router.get( "/:id",                getEvent);

// Admin only
router.post("/",    protect, adminOnly, uploadEventImage.single("image"), validate(schemas.event), createEvent);
router.put( "/:id", protect, adminOnly, uploadEventImage.single("image"), updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

// Registration (any logged-in user)
router.post(  "/:id/register", protect, registerForEvent);
router.delete("/:id/register", protect, cancelRegistration);

module.exports = router;