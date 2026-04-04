const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");
const layoutAdmin = "../layouts/admin";

exports.succeed = async (req, res) => {
  try {
    //jika tidak mengisi username dan passwordp
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ message: "data tidak lengkap" });
    }

    // validasi username

    const user = await User.findOne({ username });
    if (user) {
      return res.status(401).json("username sudah ada boss, ganti ya");
    }

    //hashedpassword

    const hashedPassword = await bcrypt.hash(password, 10);

    //save username dan password
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      role: "user",
    });

    await newUser.save();

    const data = await Post.find({});
    console.log(data);
    return res.render("admin/dashboard", { data, layout: layoutAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "register atau login error/ gagal" });
  }
};
