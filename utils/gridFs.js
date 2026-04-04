const express = require("express");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");

// Use in-memory storage

exports.sedap = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: "File tidak ada" });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "fs", // default
    });

    // const filename = Date.now() + "-" + req.file.originalname;
    // const filenames = req.files.map((file) => ({
    //   fileId: file.id, // atau file._id
    //   filename: file.filename,
    // }));

    // const uploadStream = bucket.openUploadStream(filenames, {
    //   contentType: req.files.mimetype,
    // });
    let uploadStream;
    req.files.forEach((file) => {
      uploadStream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });

      uploadStream.end(file.buffer);
    });

    // uploadStream.end(file.buffer);
    uploadStream.on("finish", () => {
      res.json({
        message: "Upload sukses",
        fileId: uploadStream.id,
        url: `/image/${uploadStream.id}`,
      });
    });

    uploadStream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ message: "Upload gagal" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.sedap = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: "No files uploaded" });
//     }

//     const urls = [];

//     for (const file of req.files) {
//       const uploadStream = bucket.openUploadStream(
//         Date.now() + "-" + file.originalname,
//         { contentType: file.mimetype }
//       );

//       uploadStream.end(file.buffer);

//       await new Promise((resolve, reject) => {
//         uploadStream.on("finish", () => {
//           urls.push(`/image/${uploadStream.id}`);
//           resolve();
//         });
//         uploadStream.on("error", reject);
//       });
//     }

//     // ⬅️ BALIKKAN ARRAY
//     res.json({ urls });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// };
