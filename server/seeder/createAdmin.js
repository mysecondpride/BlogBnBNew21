require("dotenv").config({ path: "../../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const username = process.env.ADMIN_USERNAME;
    const plainPassword = process.env.ADMIN_PASSWORD;
    const role = "admin";

    const existingAdmin = await User.findOne({ username });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists.");
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const adminUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    await adminUser.save();
    console.log("✅ Admin account created successfully.");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
