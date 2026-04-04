const express = require("express");
const mongoose = require("mongoose");
const Profile = require("../models/Profile");
const { GridFs, ObjectId } = require("mongodb");

exports.getPostProfile = async (req, res) => {
  try {
    const totalData = await Profile.countDocuments();
    if (totalData >= 1) {
      return res.status(401).json({ message: " sudah ada profile" });
    }
    return res.render("admin/post-profile");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

exports.postProfile = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "masih kosong, isi title dan blognya ya",
      });
    }
    // if (title || content) {
    //   res.redirect("admin/dasboard");
    // }

    const data = await Profile.create({
      element1: {
        title,
        content,
      },
    });

    return res.status(201).json({
      message: "berhasil post",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getPostedProfile = async (req, res) => {
  try {
    // ambil satu data profile
    const data = await Profile.findOne({});

    if (!data) {
      return res.status(404).send("Profile tidak ditemukan");
    }

    // kirim element1 secara langsung ke EJS
    const element1 = data.element1;
    const id = data.id;

    res.render("admin/profileview", {
      data,
      id,
      title: element1.title,
      content: element1.content,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("Terjadi kesalahan server");
  }
};

exports.getEditProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "ini idnya");

    const data = await Profile.findById(id);
    console.log(data, "ini datanya");

    if (!data) {
      return res.status(404).json({
        message: "Data profile tidak ditemukan",
      });
    }

    const contentBlock = data.element1
      ? data.element1
      : { title: "", content: "" };

    const title = contentBlock.title || "";
    const content = contentBlock.content || "";

    console.log(title, "ini title");

    res.render("admin/edit-post-profile", {
      data,
      title,
      content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
};
exports.editProfile = async (req, res) => {
  try {
    const { customId } = req.params;
    const { title, content } = req.body;

    const data = await Profile.findOne({ customId });
    if (!data) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    // update element1
    data.element1 = {
      title: title || "",
      content: content || "",
    };

    await data.save();

    res.status(200).json({
      message: "Terima kasih sudah mengedit",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteImageProfile = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.body.fileId);

    if (!fileId) {
      res.status(401).json({ message: "fileId yang kamu cari tidak ada" });
    }
    const bucket = new GridFSBucket(
      mongoose.connection.db({ bucketName: "fs" }),
    );
    await bucket.delete(fileId);
    res.json({ message: " selamat telah terhapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: " Server Error" });
  }
};
