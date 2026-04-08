require("dotenv").config();
const app       = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// ✅ Trust proxy (for Render / production)
app.set("trust proxy", 1);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`\n🚀 EventSphere Server running on port ${PORT}`);
      console.log(`📍 Mode: ${process.env.NODE_ENV || "development"}`);

      // ✅ Better logging for production
      if (process.env.NODE_ENV === "production") {
        console.log(`🌐 Live URL: https://eventsphere-backend-a1oy.onrender.com`);
      } else {
        console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
      }

      console.log("");
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();