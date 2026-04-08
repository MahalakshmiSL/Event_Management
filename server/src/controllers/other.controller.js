const { Contact, Subscriber, Gallery } = require("../models/index");
const Event = require("../models/Event.model");
const User  = require("../models/User.model");
const { Registration } = require("../models/index");
const { asyncHandler, apiResponse, sendEmail, emailTemplates } = require("../utils/helpers");

// ════════════════════════════════════════════════════
//  CONTACT
// ════════════════════════════════════════════════════

const submitContact = asyncHandler(async (req, res) => {
  const { name, email, specialty, message } = req.body;

  // Save to DB
  await Contact.create({ name, email, specialty, message });

  // Email to admin
  try {
    await sendEmail({
      to:      process.env.ADMIN_EMAIL,
      subject: `New Contact: ${name}`,
      html:    emailTemplates.contactAdminAlert(name, email, message),
    });
    // Confirmation to user
    await sendEmail({
      to:      email,
      subject: "We received your message – EventSphere",
      html:    emailTemplates.contactConfirmation(name),
    });
  } catch (err) {
    console.warn("Email failed (non-critical):", err.message);
  }

  apiResponse(res, 201, "Message sent successfully! We'll get back to you soon.");
});

// ════════════════════════════════════════════════════
//  SUBSCRIBER
// ════════════════════════════════════════════════════

const subscribe = asyncHandler(async (req, res) => {
  const { email, specialty } = req.body;

  const existing = await Subscriber.findOne({ email });
  if (existing) {
    if (existing.isActive) {
      return res.status(400).json({ success: false, message: "Already subscribed!" });
    }
    existing.isActive = true;
    await existing.save();
    return apiResponse(res, 200, "Welcome back! You're re-subscribed.");
  }

  await Subscriber.create({ email, specialty });

  try {
    await sendEmail({
      to:      email,
      subject: "You're subscribed to EventSphere! 🎉",
      html:    emailTemplates.subscribeConfirmation(email),
    });
  } catch (err) {
    console.warn("Email failed (non-critical):", err.message);
  }

  apiResponse(res, 201, "Successfully subscribed!");
});

const unsubscribe = asyncHandler(async (req, res) => {
  await Subscriber.findOneAndUpdate({ email: req.params.email }, { isActive: false });
  apiResponse(res, 200, "Unsubscribed successfully");
});

// ════════════════════════════════════════════════════
//  GALLERY
// ════════════════════════════════════════════════════

const getGallery = asyncHandler(async (req, res) => {
  const page     = Number(req.query.page)     || 1;
  const limit    = Number(req.query.limit)    || 12;
  const category = req.query.category;

  const query  = category ? { category } : {};
  const skip   = (page - 1) * limit;
  const total  = await Gallery.countDocuments(query);
  const images = await Gallery.find(query)
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .populate("event", "title");

  return apiResponse(res, 200, "Gallery fetched", {
    images,
    pagination: { total, page, pages: Math.ceil(total / limit) },
  });
});

const uploadGalleryImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image uploaded" });
  }

  const image = await Gallery.create({
    imageUrl:   req.file.path,
    publicId:   req.file.filename,
    caption:    req.body.caption,
    category:   req.body.category || "general",
    event:      req.body.eventId  || null,
    uploadedBy: req.user._id,
  });

  apiResponse(res, 201, "Image uploaded", image);
});

const deleteGalleryImage = asyncHandler(async (req, res) => {
  const image = await Gallery.findByIdAndDelete(req.params.id);
  if (!image) return res.status(404).json({ success: false, message: "Image not found" });

  // Delete from Cloudinary
  if (image.publicId) {
    const { cloudinary } = require("../config/cloudinary");
    await cloudinary.uploader.destroy(image.publicId);
  }

  apiResponse(res, 200, "Image deleted");
});

// ════════════════════════════════════════════════════
//  ADMIN DASHBOARD STATS
// ════════════════════════════════════════════════════

const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalEvents,
    upcomingEvents,
    totalUsers,
    totalRegistrations,
    totalContacts,
    totalSubscribers,
    recentContacts,
    topEvents,
  ] = await Promise.all([
    Event.countDocuments(),
    Event.countDocuments({ status: "upcoming", date: { $gte: new Date() } }),
    User.countDocuments({ role: "user" }),
    Registration.countDocuments(),
    Contact.countDocuments(),
    Subscriber.countDocuments({ isActive: true }),
    Contact.find({ isRead: false }).sort("-createdAt").limit(5),
    Event.find()
      .sort("-registrations")
      .limit(5)
      .select("title specialty date registrations"),
  ]);

  apiResponse(res, 200, "Dashboard stats", {
    totalEvents,
    upcomingEvents,
    totalUsers,
    totalRegistrations,
    totalContacts,
    totalSubscribers,
    recentContacts,
    topEvents,
  });
});

const getAllRegistrations = asyncHandler(async (req, res) => {
  const regs = await Registration.find()
    .populate("user",  "name email specialty")
    .populate("event", "title date specialty")
    .sort("-createdAt");
  apiResponse(res, 200, "Registrations fetched", regs);
});

const markContactRead = asyncHandler(async (req, res) => {
  await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
  apiResponse(res, 200, "Marked as read");
});

module.exports = {
  submitContact, subscribe, unsubscribe,
  getGallery, uploadGalleryImage, deleteGalleryImage,
  getDashboardStats, getAllRegistrations, markContactRead,
};