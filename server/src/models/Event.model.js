const mongoose = require("mongoose");

const speakerSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  bio:   { type: String },
  photo: { type: String }, // Cloudinary URL
  designation: { type: String },
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    specialty: {
      type: String,
      enum: ["Cardiology", "Ophthalmology", "Dentistry", "Neurology", "General", "Technology"],
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    endDate: {
      type: Date,
    },
    time: {
      type: String, // e.g. "10:00 AM - 5:00 PM"
    },
    location: {
      venue:   { type: String },
      city:    { type: String },
      country: { type: String },
      address: { type: String },
    },
    image: {
      type: String, // Cloudinary URL
      default: "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/architecture-signs.jpg",
    },
    speakers: [speakerSchema],
    isPremium: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    registrationDeadline: {
      type: Date,
    },
    maxAttendees: {
      type: Number,
      default: 500,
    },
    registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [String],
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

// Virtual: registration count
eventSchema.virtual("registrationCount").get(function () {
  if (!this.registrations) return 0;
  return this.registrations.length;
});

// Virtual: spots left
eventSchema.virtual("spotsLeft").get(function () {
  if (!this.registrations) return this.maxAttendees;
  return this.maxAttendees - this.registrations.length;
});

eventSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);