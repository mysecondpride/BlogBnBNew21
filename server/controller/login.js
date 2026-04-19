const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const cookies = require("cookie-parser");
const Post = require("../models/Post");

exports.authLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("BODY:", req.body);
console.log("USERNAME:", username);
console.log("PASSWORD:", password);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ message: "invalid credentials" });
    }


if (!jwtSecret) {
  throw new Error("JWT_SECRET belum diset di .env");
}

const token = jwt.sign(
  { id: user._id, role: user.role },
  jwtSecret,
  { expiresIn: "1d" }
);

res.cookie("token", token, { httpOnly: true });

return res.json({
  success: true,
  redirect: "/dashboard",
});

    // ⬇️ INI KUNCINYA
    // return res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        message: "Mohon maaf, data dengan ID tersebut tidak ditemukan",
      });
    }

    // hapus data

    await post.deleteOne();
    return res.json({
      success: true,
      message: "Blog berhasil dihapus",
    });

    // kirim sinyal ke client
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// module.exports = (req, res, next) => {

// };
