const express = require("express");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");

exports.sedap2 = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: "File tidak ada" });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "fs",
    });

    // Satukan semua file dari .fields()
    const allFiles = Object.values(req.files).flat();

    const results = [];

    for (const file of allFiles) {
      const uploadStream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });

      uploadStream.end(file.buffer);

      await new Promise((resolve, reject) => {
        uploadStream.on("finish", () => {
          results.push({
            fileId: uploadStream.id,
            filename: file.originalname,
            url: `/image/${uploadStream.id}`,
          });
          resolve();
        });
        uploadStream.on("error", reject);
      });
    }

    // res.json({
    //   message: "Semua file berhasil diupload",
    //   files: results,
    // });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload gagal" });
  }
};