
const mongoose=require('mongoose')
const PostProducts= require("../models/PostProducts")
  
  exports.postDisplayProducts=async (req, res) => {
    try {
      const db = mongoose.connection.db;
      const bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "fs",
      });

      


      const saveFiles = async (files) => {
        if (!files || files.length === 0) return null;

        const savedFiles = [];

        for (const file of files) {
          const stream = bucket.openUploadStream(file.originalname, {
            contentType: file.mimetype,
          });

          const fileId = stream.id; // ✅ THIS is the correct ID

          stream.end(file.buffer);

          await new Promise((resolve, reject) => {
            stream.on("finish", resolve);
            stream.on("error", reject);
          });

          savedFiles.push({
            fileId: fileId,
            filename: file.originalname,
            fileType: file.mimetype,
          url: `/files/${fileId}`,
            uploadedAt: new Date(),
          });
        }

        return savedFiles;
        

        
      };
      // Upload files
      const produk1Images = await saveFiles(req.files["Produk1Files"]);
      const produk2Image = await saveFiles(req.files["Produk2Files"]);
      const produk3Image = await saveFiles(req.files["Produk3Files"]);

      // Build document
      const post = new PostProducts({
        Produk1: [
          {
            NamaProduk1: req.body.NamaProduk1,
            Harga1: req.body.Harga1,
            Stok1: req.body.Stok1,
            Keterangan1: req.body.Keterangan1,
            fileImages: produk1Images, // this is an array
          },
        ],
        Produk2: [
          {
            NamaProduk2: req.body.NamaProduk2,
            Harga2: req.body.Harga2,
            Stok2: req.body.Stok2,
            Keterangan2: req.body.Keterangan2,
            fileImages: produk2Image ? produk2Image[0] : null, // this is a single object
          },
        ],
        Produk3: [
          {
            NamaProduk3: req.body.NamaProduk3,
            Harga3: req.body.Harga3,
            Stok3: req.body.Stok3,
            Keterangan3: req.body.Keterangan3,
            fileImages: produk3Image ? produk3Image[0] : null, // this is a single object
          },
        ],
      });

      await post.save();
      // res.status(201).json({ message: "Post created", post });
      res.redirect("/display-products");
    } catch (err) {
      console.error("Upload failed:", err);
      res.status(500).json({ error: "Upload failed", details: err.message });
    }
  }