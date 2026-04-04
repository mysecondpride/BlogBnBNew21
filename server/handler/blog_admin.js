//connectdengan env
require("dotenv").config();
//router penghubung ke database
const express = require("express");
const router = express.Router();
// router penghubung ke package dan model
var mongoose = require("mongoose");
var Post = require("../models/Post");
//connect tidak perlu lagi, hanya sekali saja//
//Penggunaan untuk put blog
const methodOverride = require("method-override");
router.use(methodOverride("_method"));
const { GridFSBucket, ObjectId } = require("mongodb");

layoutAdmin = "../layouts/admin";

exports.getPostBlog = async (req, res) => {
  try {
    res.render("admin/post-blog", { layoutAdmin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};
exports.postBlog = async (req, res) => {
  //postBlog ini saya bagi dua ya pengerjaannya, salah satunya adalah postBlog untuk menangani gambar (setelah semua paham, baru dipisah)
  try {
    const { title, content } = req.body;

    console.log(title, content);

    const data = new Post({
      customId: Date.now().toString(),
      element1: [
        {
          title,
          content,
          // url,
          images: [],
        },
      ],
    });

    await data.save();
    console.log(data);

    // JANGAN render dashboard di sini

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
};

exports.getEditBlog = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id, "ini id mu jendral getEditBlog");

    if (!id) {
      res.status(401).json({ message: " artikel tidak ditemukan" });
    }
    const data = await Post.findById(id);
    console.log(data, "ini post yang dicari");

    const contentBlock =
      data.element1 && data.element1.length > 0
        ? data.element1[0]
        : { title: "", content: "" };

    console.log(contentBlock, "cek content Blog");

    const title = contentBlock.title;
    const content = contentBlock.content;
    console.log(title, "title mu ini mas bro, jendral");

    res.render("admin/edit-post-blog", {
      data,
      title,
      content,
    });
  } catch (error) {
    res.status(401).json({ message: " error server" });
  }
};

exports.updateBlog = async (req, res) => {
  console.log("params:", req.params);
  console.log("body:", req.body);

  const { id } = req.params;
  console.log("CustomId value:", id);

  const { title, content } = req.body;

  try {
    const dataEdit = await Post.findById(id);

    if (!dataEdit) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Asumsikan hanya 1 artikel di element1
    if (dataEdit.element1 && dataEdit.element1.length > 0) {
      dataEdit.element1[0].title = title;
      dataEdit.element1[0].content = content;
    } else {
      // Jika element1 belum ada, buat baru
      dataEdit.element1 = [{ title, content }];
    }

    await dataEdit.save();
    res.status(200).json({ message: "Update successful", dataEdit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getEachArticle = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(401).json({
      message: "data yang kau minta tidak ada cuy",
    });
  }

  const display = await Post.findById(id);

  if (!display || !display.element1 || display.element1.length === 0) {
    return res.render("admin/each_article", {
      title: "Belum ada",
      content: "Belum ada",
    });
  }

  const contentBlock = display.element1[0];

  return res.render("admin/each_article", {
    title: contentBlock.title,
    content: contentBlock.content,
  });
};

exports.uploadImage = async (req, res) => {
  console.log("hit uploadimage");

  try {
    const db = mongoose.connection.db;

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "uploads",
    });

    const stream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    stream.end(req.file.buffer);

    stream.on("finish", () => {
      res.status(200).json({ url: `/files/${stream.id}` });
    });

    stream.on("error", () => {
      res.status(500).json({ error: "Upload failed" });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
