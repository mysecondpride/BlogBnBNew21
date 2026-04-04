const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const cookies = require("cookie-parser");
const Post = require("../models/Post");

exports.authLogin = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    const isEmail = email === user.email;
    if (!isPassword || !isEmail) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    console.log(user.role, "ini hasil cek role");

    // const token = jwt.sign(
    //   { userId: user._id, role: user.role, email: user.email },
    //   jwtSecret,
    // );

    const token = jwt.sign(
  {
    id: user._id,     // WAJIB _id
    role: user.role,
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

res.cookie("token", token, { httpOnly: true });

    res.cookie("token", token, { httpOnly: true });

    // harusnya ini adalah res.redirect bukan res.render
    // res.json({ success: true });

    console.log("🍪 cookies:", req.cookies);
    // console.log("👤 user:", req.user);
    console.log("TOKEN DARI COOKIE:", req.cookies.token);
    console.log("DB:", process.env.MONGODB_URI);
    return res.json({ message: " succeed" });
    // return res.redirect("admin/dashboard");
    // next();
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
