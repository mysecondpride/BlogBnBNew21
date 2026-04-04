//connectdengan env
require("dotenv").config();
//router penghubung ke database
const express = require("express");
const router = express.Router();
// router penghubung ke package dan model
var mongoose = require("mongoose");
var Post = require("../models/Post");
const layoutAdmin = "../views/layouts/admin";
//connect tidak perlu lagi, hanya sekali saja//
//Penggunaan untuk put blog

const { GridFSBucket, ObjectId } = require("mongodb");

exports.deleteImage = async (req, res) => {
  console.log("🔥 deleteImage HIT");

  try {
    // const fileId = src.split("/").pop();
    const fileId = new mongoose.Types.ObjectId(req.body.fileId);
    console.log(fileId, "ini id yang di delete ya");

    // setelah itu fileId divalidasi
    if (!fileId) {
      return res.status(401).json("file id of Image tidak ditemukan");
    }
    const bucket = new GridFSBucket(
      mongoose.connection.db({ bucketName: "fs" }),
    );
    await bucket.delete(fileId);
    res.json({ success: "selamat telah terhapus" });
  } catch (error) {
    res.status(401).json({ message: error });
  }
};
