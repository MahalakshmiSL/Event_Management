// ── asyncHandler ─────────────────────────────────────
// Wraps async controllers so you don't need try/catch in every one
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ── apiResponse ──────────────────────────────────────
// Standard success response shape
const apiResponse = (res, statusCode, message, data = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

// ── generateToken ─────────────────────────────────────
const jwt = require("jsonwebtoken");

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ── sendEmail ─────────────────────────────────────────
const transporter = require("../config/mailer");

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"EventSphere" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
};

// Email templates
const emailTemplates = {
  contactConfirmation: (name) => `
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#b5651d">Thank you, ${name}!</h2>
      <p>We've received your message and will get back to you within 24 hours.</p>
      <p style="color:#888;font-size:13px">— EventSphere Team</p>
    </div>`,

  contactAdminAlert: (name, email, message) => `
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#b5651d">New Contact Form Submission</h2>
      <p><b>From:</b> ${name} (${email})</p>
      <p><b>Message:</b></p>
      <blockquote style="border-left:3px solid #b5651d;padding-left:12px;color:#555">
        ${message}
      </blockquote>
    </div>`,

  subscribeConfirmation: (email) => `
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#b5651d">You're subscribed! 🎉</h2>
      <p>Thanks for subscribing to EventSphere. You'll be the first to know about upcoming medical conferences and events.</p>
      <p style="color:#888;font-size:13px">— EventSphere Team</p>
    </div>`,

  registrationConfirmation: (name, eventTitle, date) => `
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#b5651d">Registration Confirmed! ✅</h2>
      <p>Hi ${name}, you're registered for:</p>
      <h3>${eventTitle}</h3>
      <p><b>Date:</b> ${new Date(date).toDateString()}</p>
      <p>See you there!</p>
      <p style="color:#888;font-size:13px">— EventSphere Team</p>
    </div>`,
};

module.exports = { asyncHandler, apiResponse, generateToken, sendEmail, emailTemplates };