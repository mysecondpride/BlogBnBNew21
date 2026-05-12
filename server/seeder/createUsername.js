require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

async function seedUser() {
  const username = process.env.USER_NAME;
  const plainPassword = process.env.USER_PASSWORD;
  const email = process.env.USER_EMAIL;

  if (!username || !plainPassword || !email) {
    throw new Error("USER_NAME, USER_PASSWORD, dan USER_EMAIL wajib diset di .env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (user && user.role === "admin") {
    console.log("⚠️ Akun ditemukan sebagai admin. Role admin tidak diubah.");
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  if (user) {
    console.log("⚠️ User sudah ada. Menyinkronkan data user read-only...");

    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    user.role = "user";

    await user.save();
    console.log("✅ User read-only berhasil diperbarui");
    return;
  }

  console.log("🆕 User belum ada. Membuat user read-only baru...");

  await User.create({
    username,
    email,
    password: hashedPassword,
    role: "user",
  });

  console.log("✅ User read-only baru berhasil dibuat");
}

seedUser()
  .catch((error) => {
    console.error("❌ Gagal membuat user read-only:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
