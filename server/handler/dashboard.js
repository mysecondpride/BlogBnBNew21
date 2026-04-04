const express = require("express");
const Post = require("../models/Post");
const layoutAdmin = "../views/layouts/admin";

exports.getTheBlogDashboard = async (req, res) => {
  try {
    // const data = await Post.find({});
    const perPage = 200;
    const page = parseInt(req.query.page) || 1;

    const data = await Post.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * perPage },
      { $limit: perPage },
    ]);
    // metode klasifikasi
    const count = await Post.countDocuments(); //hitung document supaya bisa dibuat perbandingan
    const nextPage = parseInt(page) + 1; //kriteria halaman lanjutan
    const hasNextPage = nextPage <= Math.ceil(count / perPage); //output bolean, apakah punya halaman lanjutan

    console.log("PAGE:", page);
    console.log("SKIP:", (page - 1) * perPage);
    console.log("COUNT:", count);
    console.log("TOTAL PAGE:", Math.ceil(count / perPage));
    res.render("admin/dashboard", {
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      layoutAdmin,
    });
  } catch (error) {
    res.status(201).json({ message: "err" });
  }
};
