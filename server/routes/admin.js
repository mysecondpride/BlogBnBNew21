//connectdengan env
require("dotenv").config();

const { Readable } = require("stream");
//router penghubung ke database
const express = require("express");
const router = express.Router();
// router penghubung ke package dan model
var mongoose = require("mongoose");

//schema yang diperlukan:
//Schema post
const Post = require("../models/Post");
//Schema login
const User = require("../models/User");

//Layout yang dilempar ke target
const layoutAdmin = "../views/layouts/admin";

//Hashing the password
const bcrypt = require("bcrypt");

// mencocokkan token (ijin autorisasi atau API ) antara client dan server
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

//melakukan stream (lalulintas) file (streaming)

// melakukan edit, yang di HTML tersedia POST
const methodOverride = require("method-override");

router.use(methodOverride("_method"));
const uploads = require("../../utils/gridFs"); // Import GridFS upload

const PostProducts = require("../models/PostProducts");

//how to connect by connection string
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
});

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "admin",
      description: "ini adalah page dari admin",
    };
    res.render("admin/index", { locals });
  } catch (error) {
    console.log("error", error);
  }
});

/* POST */
/* Check-Login */

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log("error");
  }
});

//function that helping me out after soon we erase the cookies
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  // console.log(Object.keys(req)) kalau ingin mengetahui method yang ada di req
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }
  //jika berhasil lakukan verifikasi token//tentunya pakai try krn ini database
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};

/* POST */
/* Check-Register */

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "user created" });
    } catch (error) {
      if (error.code === 11000) {
        //jika tidak unik
        res.status(409).json({ message: "User already in use" }); //email atau password konflik
      }
      res.status(500).json({ message: "internal server error" });
    }
  } catch (error) {
    console.log("error", error);
  }
});

//dashboard
router.get("/dashboard", authMiddleware, async (req, res) => {
  //fungsi authMiddleware melindungi ketika sesion habis, token tidak permanen
  try {
    const data = await Post.find({});
    console.log(data);

    res.render("admin/dashboard", { data, layout: layoutAdmin });
  } catch (error) {
    console.log("error", error);
  }
});

/* GET */
/* admin-addpost */

router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    res.render("admin/add-post", { layout: layoutAdmin });
  } catch (error) {
    console.log("error", error);
  }
});

router.get("/post-article/:id", authMiddleware, async (req, res) => {
  try {
    const articleId = req.params.id;
    const data = await Post.findById(articleId);
    if (!data) {
      res.status(404).json({ message: "data was not foound" });
    }

    res.render("admin/post-article", { layout: layoutAdmin, data });
  } catch (error) {
    console.log("error", error);
  }
});

router.post("/add-post", uploads.array("utama", 5), async (req, res) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    const { body, title } = req.body;

    const files = req.files; // This is an array
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    const results = [];

    for (const file of files) {
      const { originalname, mimetype, buffer } = file;

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      const uploadStream = bucket.openUploadStream(originalname, {
        contentType: mimetype,
      });

      await new Promise((resolve, reject) => {
        readableStream
          .pipe(uploadStream)
          .on("error", reject)
          .on("finish", () => {
            results.push({
              fileId: uploadStream.id,
              filename: uploadStream.filename,
              contentType: mimetype,
            });
            resolve();
          });
      });
    }

    const newPost = new Post({
      title,
      body,
      files: results,
    });

    await newPost.save();

    res.status(201).json({
      message: "Files uploaded successfully",
      newPost,
    });
  } catch (err) {
    console.error("Uploads error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.get("/image/:id", (req, res) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    const { id } = req.params;
    const fileId = new mongoose.Types.ObjectId(id);
    const stream = bucket.openDownloadStream(fileId);

    stream.on("file", (file) => {
      // Set correct content type
      res.set("Content-Type", file.contentType || "image/jpg");
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err.message);
      res.status(404).json({ message: "File not found" });
    });

    stream.pipe(res);
  } catch (err) {
    console.error("Route error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "edit-post",
      description: "edit post of article",
    };
    const data = await Post.findOne({ _id: req.params.id });

    // if (!data) return res.status(404).send("updated article is not found");

    res.render("admin/edit-post", { locals, data, layout: layoutAdmin });
  } catch (error) {
    res.status(500).send("Error updating post");
  }
});

//ini masih belum fix ya......
router.put(
  "/edit-post/:id",
  uploads.single("utama"),
  authMiddleware,
  async (req, res) => {
    const { title, body } = req.body;

    try {
      // 1. Find the post by ID
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).send("Post not found");

      // 2. Delete the old image from GridFS (if a new image is uploaded)
      if (req.file && post.filename) {
        const db = mongoose.connection.db;
        const bucket = new mongoose.mongo.GridFSBucket(db, {
          bucketName: "uploads", // use your bucket name
        });

        await bucket.delete(post.filename); // remove old image by ID
      }

      // 3. Update the fields
      post.title = title;
      post.body = body;

      // 4. Update the image if new file is uploaded
      if (req.file && req.file.id) {
        post.filename = req.file.filename;
      }

      // 5. Save updated post
      await post.save();

      res.redirect("/dashboard");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating post");
    }
  }
);

router.delete("/delete-post/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/display-products", authMiddleware, async (req, res) => {
  try {
    const data = await PostProducts.find({});
    console.log(data, "ini data produk");

    res.render("admin/display-products", { layout: layoutAdmin, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong while you are getting the products.",
    });
  }
});

//segala sesuatu tentang produk
router.get("/post-display-products", authMiddleware, async (req, res) => {
  try {
    const data = await Post.find({});

    res.render("admin/post-display-products", { data, layout: layoutAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong while creating the blog post.",
    });
  }
});

router.post(
  "/post-display-products",
  authMiddleware,
  uploads.fields([
    { name: "Produk1Files", maxCount: 3 },
    { name: "Produk2Files", maxCount: 3 },
    { name: "Produk3Files", maxCount: 3 },
  ]),
  async (req, res) => {
    try {
      const db = mongoose.connection.db;
      const bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "uploads",
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
);

//images untuk produk pada post-display-product

// router.get(
//   "/imagesofproducts/:postId/:itemId",
//   authMiddleware,
//   async (req, res) => {
//     const { postId, itemId } = req.params;

//     // disini harus ada pull nya..
//     try {
//       const updatedPost = await PostProducts.findByIdAndUpdate(
//         postId,
//         { $pull: { files: { _id: itemId } } },
//         { new: true }
//       );

//       if (!updatedPost) {
//         return res.status(404).json({ message: "Post not found" });
//       }

//       // Convert string to MongoDB ObjectId
//       const fileId = new mongoose.Types.ObjectId(itemId);
//       const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//         bucketName: "uploads", // important: must match the bucket used when uploading
//       });

//       const stream = bucket.openDownloadStream(fileId);

//       stream.on("file", (file) => {
//         res.set("Content-Type", file.contentType || "application/octet-stream");
//       });

//       stream.on("error", (err) => {
//         console.error("Download stream error:", err.message);
//         if (!res.headersSent) {
//           res.status(404).json({ message: "File not found" });
//         }
//       });

//       stream.pipe(res);
//     } catch (err) {
//       return res.status(400).json({ message: "Invalid file ID" });
//     }
//   }
// );

router.get("/imagesofproducts/:postId/:fileId", async (req, res) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });

  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const stream = bucket.openDownloadStream(fileId);
    stream.pipe(res);
  } catch (err) {
    res.status(404).send("Image not found");
  }
});

router.delete(
  "/delete-item1/:postId/:itemId",
  authMiddleware,
  async (req, res) => {
    const { postId, itemId } = req.params;

    try {
      const updatedPost = await PostProducts.findByIdAndUpdate(
        postId,
        { $pull: { Produk1: { _id: itemId } } },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.redirect("/display-products");
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error deleting nested item" });
    }
  }
);
router.delete("/delete-item2/:postId/:itemId", async (req, res) => {
  const { postId, itemId } = req.params;

  try {
    const updatedPost = await PostProducts.findByIdAndUpdate(
      postId,
      { $pull: { Produk2: { _id: itemId } } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.redirect("/display-products");
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error deleting nested item" });
  }
});

router.delete("/delete-item3/:postId/:itemId", async (req, res) => {
  const { postId, itemId } = req.params;

  try {
    const updatedPost = await PostProducts.findByIdAndUpdate(
      postId,
      { $pull: { Produk3: { _id: itemId } } },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.redirect("/display-products");
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error deleting nested item" });
  }
});

// router.get("/edit-item-input/:itemId/:elementId", async (req, res) => {
//   const groupId = req.params.itemId;
//   const elementId = req.params.elementId;

//   try {
//     const data = await PostProducts.findOne({
//       groupId: groupId,
//       elementId: elementId,
//     });

//     res.render("admin/edit-postdisplay", { data, layout: layoutAdmin });
//   } catch (err) {
//     console.error("Error fetching post:", err);
//     res.status(500).send("Server error");
//   }
// });

// router.get("/edit-item-input/:groupId/:elementId", async (req, res) => {
//   const { groupId, elementId } = req.params;

//   try {
//     const post = await PostProducts.findById(groupId);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const item = post.Produk1.id(elementId);
//     if (!item) {
//       return res.status(404).json({ message: "Item not found in Produk2" });
//     }

//     res.render("admin/edit-postdisplay", { data: item, layout: layoutAdmin });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: "Error fetching nested item" });
//   }
// });

router.get(
  "/edit-item-input/:groupId/:elementId",
  authMiddleware,
  async (req, res) => {
    const { groupId, elementId } = req.params;

    try {
      const post = await PostProducts.findById(groupId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Try to find in each array
      let item =
        post.Produk1.id(elementId) ||
        post.Produk2.id(elementId) ||
        post.Produk3.id(elementId);

      if (!item) {
        return res
          .status(404)
          .json({ message: "Item not found in any Produk array" });
      }

      let productName =
        item.NamaProduk1 || item.NamaProduk2 || item.NamaProduk3;

      res.render("admin/edit-postdisplay", {
        data: item,
        productName,
        layout: layoutAdmin,
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error fetching nested item" });
    }
  }
);

//how to post the edit-product-display
router.put("/edit-postdisplay/:groupId", authMiddleware, async (req, res) => {
  const { groupId } = req.params;
  const { ProductName, Price, Stock } = req.body;

  try {
    const dataEdit = await PostProducts.findOne({
      $or: [
        { "Produk1._id": groupId },
        { "Produk2._id": groupId },
        { "Produk3._id": groupId },
      ],
    });

    if (!dataEdit) {
      return res.status(404).json({ message: "Data not found" });
    }

    let updated = false;

    // Check Produk1
    const produk1Item = dataEdit.Produk1.find(
      (p) => p._id.toString() === groupId
    );
    if (produk1Item) {
      produk1Item.NamaProduk1 = ProductName;
      produk1Item.Harga1 = Price;
      produk1Item.Stok1 = Stock;
      updated = true;
    }

    // Check Produk2
    const produk2Item = dataEdit.Produk2.find(
      (p) => p._id.toString() === groupId
    );
    if (produk2Item) {
      produk2Item.NamaProduk2 = ProductName;
      produk2Item.Harga2 = Price;
      produk2Item.Stok2 = Stock;
      updated = true;
    }

    // Check Produk3
    const produk3Item = dataEdit.Produk3.find(
      (p) => p._id.toString() === groupId
    );
    if (produk3Item) {
      produk3Item.NamaProduk3 = ProductName;
      produk3Item.Harga3 = Price;
      produk3Item.Stok3 = Stock;
      updated = true;
    }

    if (!updated) {
      return res.status(404).json({ message: "No matching product found" });
    }

    await dataEdit.save();

    res.status(200).json({ dataEdit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// how to log out from the web app
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Logout failed");
    }
    res.redirect("/admin"); // or wherever you want
  });
});
module.exports = router;
