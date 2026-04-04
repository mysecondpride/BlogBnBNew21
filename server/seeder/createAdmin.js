require("dotenv").config({ path: "../../.env" });
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
///require("dotenv").config({ path: "../../.env" });
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const User = require("../models/User");

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(async () => {
//     const username = process.env.ADMIN_USERNAME;
//     const plainPassword = process.env.ADMIN_PASSWORD;
//     const email = process.env.ADMIN_EMAIL;

  //   const existingAdmin = await User.findOne({ role: "admin" });

  //   if (existingAdmin) {
  //     // ADMIN SUDAH ADA
  //     if (!existingAdmin.email) {
  //       existingAdmin.email = email;
  //       await existingAdmin.save();
  //       console.log("✅ Email admin lama berhasil ditambahkan");
  //     } else {
  //       console.log("⚠️ Admin sudah ada dan email sudah terisi");
  //     }
  //   } else {
  //     // ADMIN BELUM ADA → BUAT BARU
  //     const hashedPassword = await bcrypt.hash(plainPassword, 10);

  //     await User.create({
  //       username,
  //       email,
  //       password: hashedPassword,
  //       role: "admin",
  //     });

  //     console.log("✅ Admin baru berhasil dibuat");
  //   }

  //   process.exit();
  // })
  // .catch((err) => {
  //   console.error("❌ MongoDB connection error:", err);
  //   process.exit(1);
  // });
