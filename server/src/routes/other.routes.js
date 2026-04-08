const express = require("express");
const {
  submitContact, subscribe, unsubscribe,
  getGallery, uploadGalleryImage, deleteGalleryImage,
  getDashboardStats, getAllRegistrations, markContactRead,
} = require("../controllers/other.controller");
const { protect, adminOnly, validate, schemas } = require("../middleware/index");
const { uploadGalleryImage: galleryUpload } = require("../config/cloudinary");

// ── Contact ──────────────────────────────────────────
const contactRouter = express.Router();
contactRouter.post("/", validate(schemas.contact), submitContact);

// ── Subscriber ───────────────────────────────────────
const subscriberRouter = express.Router();
subscriberRouter.post(  "/",                  validate(schemas.subscribe), subscribe);
subscriberRouter.delete("/:email",            unsubscribe);

// ── Gallery ──────────────────────────────────────────
const galleryRouter = express.Router();
galleryRouter.get( "/",    getGallery);
galleryRouter.post("/",    protect, adminOnly, galleryUpload.single("image"), uploadGalleryImage);
galleryRouter.delete("/:id", protect, adminOnly, deleteGalleryImage);

// ── Admin ─────────────────────────────────────────────
const adminRouter = express.Router();
adminRouter.use(protect, adminOnly);
adminRouter.get("/stats",                   getDashboardStats);
adminRouter.get("/registrations",           getAllRegistrations);
adminRouter.patch("/contacts/:id/read",     markContactRead);

module.exports = { contactRouter, subscriberRouter, galleryRouter, adminRouter };