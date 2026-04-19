const express= require('express')
const mongoose = require("mongoose");

exports.sedap = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files" });
    }

    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database not connected");
    }

    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "fs",
    });

    const results = [];

    for (const file of req.files) {
      const uploadStream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });

      const done = new Promise((resolve, reject) => {
        uploadStream.on("error", (err) => {
          console.error("Stream error:", err);
          reject(err);
        });

        uploadStream.on("finish", async () => {
          try {
            // 🔥 WAJIB: tunggu sampai file benar-benar bisa dibaca GridFS
            const filesColl = db.collection("fs.files");

            let found = null;
            while (!found) {
              found = await filesColl.findOne({ _id: uploadStream.id });
              if (!found) {
                await new Promise((r) => setTimeout(r, 30));
              }
            }

            results.push({
              url: `/image/${uploadStream.id}`,
              fileId: uploadStream.id,
            });

            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });

      // kirim buffer ke GridFS
      uploadStream.end(file.buffer);

      // tunggu upload + ready-to-read
      await done;
    }

    // Summernote butuh satu URL saja
    res.json(results[0]);
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};