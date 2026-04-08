const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for event images
const eventStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "eventsphere/events",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 500, crop: "fill" }],
  },
});

// Storage for gallery images
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "eventsphere/gallery",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, quality: "auto" }],
  },
});

const uploadEventImage   = multer({ storage: eventStorage });
const uploadGalleryImage = multer({ storage: galleryStorage });

module.exports = { cloudinary, uploadEventImage, uploadGalleryImage };