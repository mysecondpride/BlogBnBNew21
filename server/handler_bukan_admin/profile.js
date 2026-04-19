const express = require("express");
const Profile = require("../models/Profile");

exports.getProfileVistior = async (req, res) => {
  try {
    const local = "Mr.Tom Debugging MERN";
    const description =
      "Mr. Tom Debugging adalah blog hasil experience penulis terhadap MERN...";

    const profile = await Profile.findOne({});

    // CASE 1: profile tidak ada
    if (!profile) {
      return res.status(404).render("index", {
        title: "Profile belum tersedia",
        content: "Admin belum mengisi profile.",
        local,
        description,
      });
    }

    // CASE 2: element1 tidak ada
    if (!profile.element1) {
      return res.status(404).render("index", {
        title: "Element profile belum ada",
        content: "Data profile belum lengkap.",
        local,
        description,
      });
    }

    // CASE 3: data lengkap
    const { title, content } = profile.element1;

    return res.render("index", { title, content, local, description });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "serverError" });
  }
};
