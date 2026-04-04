const express = require("express");

const mongoose = require("mongoose");
const { GridFSBucket, ObjectId } = require("mongodb");

exports.downloadImage = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "fs" });

    //ini tambahannya ya, saat gambar disatukan dalam arrayy ini adalah setelah penyatuan skema

    const _id = new mongoose.Types.ObjectId(req.params.id);

    const files = await bucket.find({ _id }).toArray();
    if (!files.length) {
      return res.status(404).send("File not found");
    }

    res.set("Content-Type", files[0].contentType);
    const downloadStream = bucket.openDownloadStream(_id);

    downloadStream.on("error", (err) => {
      console.error(err);
      res.status(404).send("File not found");
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
