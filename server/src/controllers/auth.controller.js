const User = require("../models/User.model");
const { asyncHandler, apiResponse, generateToken } = require("../utils/helpers");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, specialty } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: "Email already registered" });
  }

  const user = await User.create({ name, email, password, specialty });
  const token = generateToken(user._id);

  apiResponse(res, 201, "Account created successfully", {
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, specialty: user.specialty },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const token = generateToken(user._id);

  apiResponse(res, 200, "Login successful", {
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, specialty: user.specialty },
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("savedEvents", "title date image specialty");
  apiResponse(res, 200, "Profile fetched", user);
});

// @desc    Save / unsave an event (toggle)
// @route   PUT /api/auth/save-event/:eventId
// @access  Private
const toggleSaveEvent = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const eventId = req.params.eventId;

  const index = user.savedEvents.indexOf(eventId);
  let message;

  if (index === -1) {
    user.savedEvents.push(eventId);
    message = "Event saved";
  } else {
    user.savedEvents.splice(index, 1);
    message = "Event removed from saved";
  }

  await user.save();
  apiResponse(res, 200, message, { savedEvents: user.savedEvents });
});

module.exports = { register, login, getMe, toggleSaveEvent };