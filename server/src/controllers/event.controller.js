const Event = require("../models/Event.model");
const { Registration } = require("../models/index");
const { asyncHandler, apiResponse, sendEmail, emailTemplates } = require("../utils/helpers");

// @desc    Get all events (with filter, search, pagination)
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
  const page      = Number(req.query.page)      || 1;
  const limit     = Number(req.query.limit)     || 9;
  const sort      = req.query.sort              || "-date";
  const specialty = req.query.specialty;
  const status    = req.query.status;
  const isPremium = req.query.isPremium;
  const isFeatured= req.query.isFeatured;
  const search    = req.query.search;

  const query = {};
  if (specialty)  query.specialty  = specialty;
  if (status)     query.status     = status;
  if (isPremium  !== undefined && isPremium  !== "") query.isPremium  = isPremium  === "true";
  if (isFeatured !== undefined && isFeatured !== "") query.isFeatured = isFeatured === "true";
  if (search) {
    query.$or = [
      { title:       { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags:        { $in: [new RegExp(search, "i")] } },
    ];
  }

  const skip   = (page - 1) * limit;
  const total  = await Event.countDocuments(query);
  const events = await Event.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select("-registrations");

  return apiResponse(res, 200, "Events fetched", {
    events,
    pagination: { total, page, pages: Math.ceil(total / limit), limit },
  });
});
// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }
  apiResponse(res, 200, "Event fetched", event);
});

// @desc    Create event (admin)
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
  // If image uploaded via Cloudinary middleware
  if (req.file) req.body.image = req.file.path;

  const event = await Event.create(req.body);
  apiResponse(res, 201, "Event created successfully", event);
});

// @desc    Update event (admin)
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = asyncHandler(async (req, res) => {
  if (req.file) req.body.image = req.file.path;

  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  apiResponse(res, 200, "Event updated", event);
});

// @desc    Delete event (admin)
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }
  // Also remove all registrations for this event
  await Registration.deleteMany({ event: req.params.id });
  apiResponse(res, 200, "Event deleted");
});

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  // Check spots
  if (event.registrations.length >= event.maxAttendees) {
    return res.status(400).json({ success: false, message: "Event is fully booked" });
  }

  // Check already registered
  if (event.registrations.includes(req.user._id)) {
    return res.status(400).json({ success: false, message: "Already registered for this event" });
  }

  // Create registration record
  await Registration.create({ user: req.user._id, event: event._id });

  // Add to event's registrations array
  event.registrations.push(req.user._id);
  await event.save();

  // Send confirmation email
  try {
    await sendEmail({
      to:      req.user.email,
      subject: `Registration Confirmed – ${event.title}`,
      html:    emailTemplates.registrationConfirmation(req.user.name, event.title, event.date),
    });
  } catch (err) {
    console.warn("Email failed (non-critical):", err.message);
  }

  apiResponse(res, 201, "Successfully registered for event", {
    eventId: event._id,
    status:  "confirmed",
  });
});

// @desc    Cancel event registration
// @route   DELETE /api/events/:id/register
// @access  Private
const cancelRegistration = asyncHandler(async (req, res) => {
  await Registration.findOneAndDelete({ user: req.user._id, event: req.params.id });

  await Event.findByIdAndUpdate(req.params.id, {
    $pull: { registrations: req.user._id },
  });

  apiResponse(res, 200, "Registration cancelled");
});

// @desc    Get upcoming featured event (for homepage hero countdown)
// @route   GET /api/events/featured
// @access  Public
const getFeaturedEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOne({
    isFeatured: true,
    date: { $gte: new Date() },
  })
    .sort({ date: 1 })
    .select("-registrations");

  apiResponse(res, 200, "Featured event", event);
});

module.exports = {
  getEvents, getEvent, createEvent, updateEvent,
  deleteEvent, registerForEvent, cancelRegistration, getFeaturedEvent,
};