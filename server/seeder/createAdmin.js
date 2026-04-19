require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const username = process.env.ADMIN_USERNAME;
  const plainPassword = process.env.ADMIN_PASSWORD;
  const email = process.env.ADMIN_EMAIL;

  // Cek berdasarkan USER yang mau dijadikan admin
  let user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (user) {
    console.log("⚠️ User sudah ada. Mengubah role menjadi admin...");

    user.role = "admin";

    // kalau mau sekalian update password dari env
    user.password = await bcrypt.hash(plainPassword, 10);

    await user.save();

    console.log("✅ User existing berhasil dijadikan admin");
  } else {
    console.log("🆕 User belum ada. Membuat admin baru...");

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin baru berhasil dibuat");
  }

  process.exit();
});

