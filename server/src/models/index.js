const mongoose = require("mongoose");

// ── Registration ─────────────────────────────────────
const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "waitlisted", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

// Prevent duplicate registrations
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

// ── Contact ──────────────────────────────────────────
const contactSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, lowercase: true },
    specialty: { type: String },
    message:   { type: String, required: true },
    isRead:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ── Gallery ──────────────────────────────────────────
const gallerySchema = new mongoose.Schema(
  {
    imageUrl:    { type: String, required: true },
    publicId:    { type: String }, // Cloudinary public_id for deletion
    caption:     { type: String },
    event:       { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category:    {
      type: String,
      enum: ["conference", "workshop", "ceremony", "exhibition", "general"],
      default: "general",
    },
  },
  { timestamps: true }
);

// ── Subscriber ───────────────────────────────────────
const subscriberSchema = new mongoose.Schema(
  {
    email:     { type: String, required: true, unique: true, lowercase: true },
    specialty: { type: String },
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = {
  Registration: mongoose.model("Registration", registrationSchema),
  Contact:      mongoose.model("Contact",      contactSchema),
  Gallery:      mongoose.model("Gallery",      gallerySchema),
  Subscriber:   mongoose.model("Subscriber",   subscriberSchema),
};