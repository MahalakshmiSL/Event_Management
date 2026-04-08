// ════════════════════════════════════════════════════
//  middleware/auth.middleware.js
// ════════════════════════════════════════════════════
const jwt  = require("jsonwebtoken");
const User = require("../models/User.model");
const { asyncHandler } = require("../utils/helpers");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorised, no token" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) {
    return res.status(401).json({ success: false, message: "User no longer exists" });
  }

  next();
});

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access only" });
  }
  next();
};

// ════════════════════════════════════════════════════
//  middleware/validate.middleware.js  (Joi)
// ════════════════════════════════════════════════════
const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(", ");
    return res.status(400).json({ success: false, message: messages });
  }
  next();
};

// Validation schemas
const schemas = {
  register: Joi.object({
    name:      Joi.string().min(2).max(50).required(),
    email:     Joi.string().email().required(),
    password:  Joi.string().min(6).required(),
    specialty: Joi.string().valid("Cardiology","Ophthalmology","Dentistry","Neurology","General","Other"),
  }),

  login: Joi.object({
    email:    Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  contact: Joi.object({
    name:      Joi.string().min(2).max(100).required(),
    email:     Joi.string().email().required(),
    specialty: Joi.string().allow(""),
    message:   Joi.string().min(10).max(1000).required(),
  }),

  subscribe: Joi.object({
    email:     Joi.string().email().required(),
    specialty: Joi.string().allow(""),
  }),

  event: Joi.object({
    title:       Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    specialty:   Joi.string().valid("Cardiology","Ophthalmology","Dentistry","Neurology","General","Technology").required(),
    date:        Joi.date().required(),
    endDate:     Joi.date().allow(null, ""),
    time:        Joi.string().allow(""),
    location:    Joi.object({
      venue:   Joi.string().allow(""),
      city:    Joi.string().allow(""),
      country: Joi.string().allow(""),
      address: Joi.string().allow(""),
    }),
    isPremium:   Joi.boolean(),
    isFeatured:  Joi.boolean(),
    maxAttendees: Joi.number(),
    tags:        Joi.array().items(Joi.string()),
    speakers:    Joi.array().items(Joi.object({
      name:        Joi.string().required(),
      bio:         Joi.string().allow(""),
      photo:       Joi.string().allow(""),
      designation: Joi.string().allow(""),
    })),
  }),
};

// ════════════════════════════════════════════════════
//  middleware/errorHandler.js
// ════════════════════════════════════════════════════
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || "Internal Server Error";

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message    = `${field} already exists`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    message    = Object.values(err.errors).map((e) => e.message).join(", ");
    statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError")  { message = "Invalid token";  statusCode = 401; }
  if (err.name === "TokenExpiredError")  { message = "Token expired";  statusCode = 401; }

  if (process.env.NODE_ENV === "development") {
    console.error("💥", err);
  }

  res.status(statusCode).json({ success: false, message });
};

// ════════════════════════════════════════════════════
//  middleware/rateLimiter.js
// ════════════════════════════════════════════════════
const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "development" ? 1000 : 100, // ← higher in dev
  message: { success: false, message: "Too many requests, please try again later" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "development" ? 1000 : 10, // ← higher in dev
  message: { success: false, message: "Too many login attempts, please try again later" },
});

module.exports = { protect, adminOnly, validate, schemas, errorHandler, generalLimiter, authLimiter };