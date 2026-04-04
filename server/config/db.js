const mongoose = require("mongoose");
require("dotenv").config(); // WAJIB agar env terbaca

const connectDB = async () => {
  try {
    console.log("📡 Connecting to:", process.env.MONGODB_URI); // Debug log

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop app kalau error
  }
};

module.exports = connectDB;
