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
const MenTan = require("../models/ManagementTanam");

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

router.get("/robots.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "robots.txt"));
});

// router.post("/admin", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(401).json({ message: "invalid credentials" });
//     }
//     const isPassword = await bcrypt.compare(password, user.password);
//     if (!isPassword) {
//       return res.status(401).json({ message: "invalid credentials" });
//     }
//     const token = jwt.sign({ userId: user._id }, jwtSecret);
//     res.cookie("token", token, { httpOnly: true });
//     res.redirect("/dashboard");
//   } catch (error) {
//     console.log("error");
//   }
// });



router.post('/admin', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.render("admin/dashboard", { error: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.render("admin/dashboard", { error: "Wrong password" });
  }

  // Simpan ke session
  req.session.userId = user._id;
  req.session.role = user.role;

  res.redirect("/dashboard");
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

// router.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     try {
//       const user = await User.create({ username, password: hashedPassword });
//       res.status(201).json({ message: "user created" });
//     } catch (error) {
//       if (error.code === 11000) {
//         //jika tidak unik
//         res.status(409).json({ message: "User already in use" }); //email atau password konflik
//       }
//       res.status(500).json({ message: "internal server error" });
//     }
//   } catch (error) {
//     console.log("error", error);
//   }
// });

// dashboard
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



router.post("/upload-image", uploads.single("image"), async (req, res) => {
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
});

router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = new Post({
      customId: Date.now().toString(),
      element1: [
        {
          title,
          content,
          url: null, // jika tidak ada URL
          files: [],
        },
      ],
    });

    await post.save();
    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});
const { Types } = require("mongoose");
const ManagementHidro = require("../models/ManagementHidro");

router.get("/post-article/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    const contentBlock =
      post.element1 && post.element1.length > 0
        ? post.element1[0]
        : { title: "", content: "" };

    res.render("admin/post-article", {
      title: contentBlock.title,
      content: contentBlock.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/files/:id", async (req, res) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });

  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on("error", (err) => {
      console.error("File download error:", err.message);
      res.status(404).send("Image not found");
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error("Invalid file ID:", err.message);
    res.status(400).send("Invalid file ID");
  }
});

router.delete("/delete-post/:customId", async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({
      customId: req.params.customId,
    });
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.redirect("/dashboard");
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

router.get("/post-mentan", authMiddleware, async (req, res) => {
  try {
    const data = await MenTan.find({});
    console.log(data, "ini data produk");

    res.render("admin/formMentan", { layout: layoutAdmin, data });
  } catch (err) {
    console.error(err);
    // res.redirect("admin/displayMentan", { data, layout: layoutAdmin });
  }
});

router.get("/display-mentan", authMiddleware, async (req, res) => {
  //fungsi authMiddleware melindungi ketika sesion habis, token tidak permanen
  try {
    const data = await MenTan.find({});
    console.log(data);

    res.render("admin/displayMentan", { data, layout: layoutAdmin });
  } catch (error) {
    console.log("error", error);
  }
});

router.get("/imagesofpetak1/:postId/:fileId", async (req, res) => {
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

router.get("/imagesofpetak2/:postId/:fileId", async (req, res) => {
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

router.post(
  "/post-mentan",
  authMiddleware,
  uploads.fields([
    { name: "Progress1", maxCount: 3 },
    { name: "Progress2", maxCount: 3 },
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
      const DokProg1 = await saveFiles(req.files["Progress1"]);
      const DokProg2 = await saveFiles(req.files["Progress2"]);

      // Build document
      const post = new MenTan({
        Petak1: [
          {
            ObatSuketAwal1: req.body.OSukAwal1,
            PengolahanLahanPetak1: req.body.PengLaTak1,
            DolomitPetak1: req.body.DolomitPetak1,
            KetersediaanCompostTea_Jadam1: req.body.CTAvailable1,
            KetersediaanCompostdanBio1: req.body.KompostdanBio1,
            JenisBibitPetak1: req.body.TypeSeeds1,
            MasukMediaBioChar1: req.body.EnterBiochar1,
            TanggalTanamPetak1: req.body.DatePlant1,
            ObatSuket10Hari1: req.body.Osukten1,
            KocorCompostTea1: req.body.kocorCT1,
            JadamSulfur1: req.body.Jasur1,
            ControlSuket1_1: req.body.grass1_1,
            PenyiramanTahap1_1: req.body.Watering1_1,
            TglPemupukan1_1: req.body.DateFertilizerVeg1,
            PupukVegetatifMakro1: req.body.VegMakro1,
            ControlSuket2_1: req.body.grass2_1,
            PenyiramanTahap2_1: req.body.Watering2_1,
            TglPemupukanGen1: req.body.DateFerGen1,
            PupukGeneratifMakro1: req.body.GenMakro1,
            ObatUlat1: req.body.CaterPiler1,
            UsiaPanendanKendala1: req.body.HarvestAge1,
            Rata_rataBb1: req.body.averageBB1,
            DokProgress1: DokProg1,
          },
        ],
        Petak2: [
          {
            ObatSuketAwal2: req.body.OSukAwal2,
            PengolahanLahanPetak2: req.body.PengLaTak2,
            DolomitPetak2: req.body.DolomitPetak2,
            KetersediaanCompostTea_Jadam2: req.body.CTAvailable2,
            KetersediaanCompostdanBio2: req.body.KompostdanBio2,
            JenisBibitPetak2: req.body.TypeSeeds2,
            MasukMediaBioChar2: req.body.EnterBiochar2,
            TanggalTanamPetak2: req.body.DatePlant2,
            ObatSuket10Hari2: req.body.Osukten2,
            KocorCompostTea2: req.body.kocorCT2,
            JadamSulfur2: req.body.Jasur2,
            ControlSuket1_2: req.body.grass1_2,
            PenyiramanTahap1_2: req.body.Watering1_2,
            TglPemupukan1_2: req.body.DateFertilizerVeg2,
            PupukVegetatifMakro2: req.body.VegMakro2,
            ControlSuket2_2: req.body.grass2_2,
            PenyiramanTahap2_2: req.body.Watering2_2,
            TglPemupukanGen2: req.body.DateFerGen2,
            PupukGeneratifMakro2: req.body.GenMakro2,
            ObatUlat2: req.body.CaterPiler2,
            UsiaPanendanKendala2: req.body.HarvestAge2,
            Rata_rataBb2: req.body.averageBB2,
            DokProgress2: DokProg2,
          },
        ],
        Petak3: [
          {
            ObatSuketAwal3: req.body.OSukAwal3,
            JenisBibitPetak3: req.body.TypeSeeds3,
            TanggalTanamPetak3: req.body.DatePlant3,
            ObatSuket10Hari3: req.body.Osukten3,
            JadamSulfur3: req.body.Jasur3,
            TglPemupukan1_3: req.body.DateFertilizerVeg3,
            PupukVegetatifMakro3: req.body.VegMakro3,
            TglPemupukanGen3: req.body.DateFerGen3,
            PupukGeneratifMakro3: req.body.GenMakro3,
            ObatUlat3: req.body.CaterPiler3,
            UsiaPanenPetak3: req.body.HarvestAge3,
            Rata_rataBb3: req.body.averageBB3,
          },
        ],
      });
      await post.save();
      res.status(201).json({ message: "Post created", post });
    } catch (err) {
      console.error("Upload failed:", err);
      res.status(500).json({ error: "Upload failed", details: err.message });
    }
  }
);

router.get(
  "/imagesofpetak1/:postId/:fileId",
  authMiddleware,
  async (req, res) => {
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
  }
);
router.delete(
  "/delete-item1-petak1/:postId/:itemId",
  authMiddleware,
  async (req, res) => {
    const { postId, itemId } = req.params;

    try {
      const updatedPost = await MenTan.findByIdAndUpdate(
        postId,
        { $pull: { Petak1: { _id: itemId } } },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.redirect("/display-mentan");
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error deleting nested item" });
    }
  }
);

router.delete("/delete-item1-petak2/:postId/:itemId", async (req, res) => {
  const { postId, itemId } = req.params;

  try {
    const updatedPost = await MenTan.findByIdAndUpdate(
      postId,
      { $pull: { Petak2: { _id: itemId } } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.redirect("/display-mentan");
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error deleting nested item" });
  }
});

router.delete("/delete-item1-petak3/:postId/:itemId", async (req, res) => {
  const { postId, itemId } = req.params;
  console.log("DELETE PETAK1 HIT", postId, itemId);

  try {
    const updatedPost = await MenTan.findByIdAndUpdate(
      postId,
      { $pull: { Petak3: { _id: itemId } } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.redirect("/display-mentan");
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error deleting nested item" });
  }
});

router.put("/edit-item-petak/:groupId", authMiddleware, async (req, res) => {
  const { groupId } = req.params;
  const {
    OSukAwal,
    PengLaTak,
    DolomitPetak,
    CTAvailable,
    KompostdanBio,
    TypeSeeds,
    EnterBiochar,
    DatePlant,
    Osukten,
    kocorCT,
    Jasur,
    grass1,
    Watering1,
    DateFertilizerVeg,
    VegMakro,
    grass2,
    Watering2,
    DateFerGen,
    GenMakro,
    CaterPiler,
    averageBB,
    HarvestAge,
  } = req.body;

  console.log(
    OSukAwal,
    PengLaTak,
    DolomitPetak,
    CTAvailable,
    KompostdanBio,
    TypeSeeds,
    EnterBiochar,
    DatePlant,
    Osukten,
    kocorCT,
    Jasur,
    grass1,
    Watering1,
    DateFertilizerVeg,
    VegMakro,
    grass2,
    Watering2,
    DateFerGen,
    GenMakro,
    CaterPiler,
    averageBB,
    HarvestAge
  );

  try {
    const dataEdit = await MenTan.findOne({
      $or: [
        { "Petak1._id": groupId },
        { "Petak2._id": groupId },
        { "Petak3._id": groupId },
      ],
    });

    if (!dataEdit) {
      return res.status(404).json({ message: "Data not found" });
    }
    let updated = false;
    // Check Petak1
    const petak1Item = Array.isArray(dataEdit.Petak1)
      ? dataEdit.Petak1.find((p) => p._id.toString() === groupId.toString())
      : null;
    if (petak1Item) {
      petak1Item.ObatSuketAwal1 = OSukAwal;
      petak1Item.PengolahanLahanPetak1 = PengLaTak;
      petak1Item.DolomitPetak1 = DolomitPetak;
      petak1Item.KetersediaanCompostTea_Jadam1 = CTAvailable;
      petak1Item.KetersediaanCompostdanBio1 = KompostdanBio;
      petak1Item.JenisBibitPetak1 = TypeSeeds;
      petak1Item.MasukMediaBioChar1 = EnterBiochar;
      petak1Item.TanggalTanamPetak1 = DatePlant;
      petak1Item.ObatSuket10Hari1 = Osukten;
      petak1Item.KocorCompostTea1 = kocorCT;
      petak1Item.JadamSulfur1 = Jasur;
      petak1Item.ControlSuket1_1 = grass1;
      petak1Item.PenyiramanTahap1_1 = Watering1;
      petak1Item.TglPemupukan1_1 = DateFertilizerVeg;
      petak1Item.PupukVegetatifMakro1 = VegMakro;
      petak1Item.ControlSuket2_1 = grass2;
      petak1Item.PenyiramanTahap2_1 = Watering2;
      petak1Item.TglPemupukanGen1 = DateFerGen;
      petak1Item.PupukGeneratifMakro1 = GenMakro;
      petak1Item.ObatUlat1 = CaterPiler;
      petak1Item.UsiaPanendanKendala1 = HarvestAge;
      petak1Item.Rata_rataBb1 = averageBB;
      updated = true;
    }

    // Check Petak2
    const petak2Item = Array.isArray(dataEdit.Petak2)
      ? dataEdit.Petak2.find((p) => p._id.toString() === groupId.toString())
      : null;
    if (petak2Item) {
      petak2Item.ObatSuketAwal2 = OSukAwal;
      petak2Item.PengolahanLahanPetak2 = PengLaTak;
      petak2Item.DolomitPetak2 = DolomitPetak;
      petak2Item.KetersediaanCompostTea_Jadam2 = CTAvailable;
      petak2Item.KetersediaanCompostdanBio2 = KompostdanBio;
      petak2Item.JenisBibitPetak2 = TypeSeeds;
      petak2Item.MasukMediaBioChar2 = EnterBiochar;
      petak2Item.TanggalTanamPetak2 = DatePlant;
      petak2Item.ObatSuket10Hari2 = Osukten;
      petak2Item.KocorCompostTea2 = kocorCT;
      petak2Item.JadamSulfur2 = Jasur;
      petak2Item.ControlSuket1_2 = grass1;
      petak2Item.PenyiramanTahap1_2 = Watering1;
      petak2Item.TglPemupukan1_2 = DateFertilizerVeg;
      petak2Item.PupukVegetatifMakro2 = VegMakro;
      petak2Item.ControlSuket2_2 = grass2;
      petak2Item.PenyiramanTahap2_2 = Watering2;
      petak2Item.TglPemupukanGen2 = DateFerGen;
      petak2Item.PupukGeneratifMakro2 = GenMakro;
      petak2Item.ObatUlat2 = CaterPiler;
      petak2Item.UsiaPanendanKendala2 = HarvestAge;
      petak2Item.Rata_rataBb2 = averageBB;
      updated = true;
    }

    // Check Petak3
    const petak3Item = dataEdit.Petak3.find(
      (p) => p._id.toString() === groupId
    );
    if (petak3Item) {
      petak3Item.ObatSuketAwal3 = OSukAwal;
      petak3Item.JenisBibitPetak3 = TypeSeeds;
      petak3Item.TanggalTanamPetak3 = DatePlant;
      petak3Item.JadamSulfur3 = Jasur;
      petak3Item.TglPemupukan1_3 = DateFertilizerVeg;
      petak3Item.PupukVegetatifMakro3 = VegMakro;
      petak3Item.TglPemupukanGen3 = DateFerGen;
      petak3Item.PupukGeneratifMakro3 = GenMakro;
      petak3Item.ObatUlat3 = CaterPiler;
      petak3Item.UsiaPanenPetak3 = HarvestAge;
      petak3Item.Rata_rataBb3 = averageBB;

      updated = true;
    }
    console.log("groupId:", groupId);
    console.log("dataEdit:", dataEdit);
    console.log("Petak1:", dataEdit.Petak1);
    console.log("Petak2:", dataEdit.Petak2);

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

router.get("/display-hidro", authMiddleware, async (req, res) => {
  try {
    const data = await ManagementHidro.find({});
    console.log(data, "ini data management hidroponik");

    res.render("admin/displayHidro", { layout: layoutAdmin, data });
  } catch (err) {
    console.error(err);
    // res.redirect("admin/displayMentan", { data, layout: layoutAdmin });
  }
});

router.get("/post-hidro", authMiddleware, async (req, res) => {
  try {
    const data = await ManagementHidro.find({});
    console.log(data, "ini data produk");

    res.render("admin/formHidroponik", { layout: layoutAdmin, data });
  } catch (err) {
    console.error(err);
    // res.redirect("admin/displayMentan", { data, layout: layoutAdmin });
  }
});

router.post(
  "/post-hidro",
  authMiddleware,
  uploads.fields([
    { name: "Progress1", maxCount: 3 },
    { name: "Progress2", maxCount: 3 },
    { name: "Progress3", maxCount: 3 },
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
      const DokProg1 = await saveFiles(req.files["Progress1"]);
      const DokProg2 = await saveFiles(req.files["Progress2"]);
      const DokProg3 = await saveFiles(req.files["Progress3"]);

      // Build document
      const post = new ManagementHidro({
        Kebun1: [
          {
            TglSemai1: req.body.DateOfScatter1,
            JenisBibitKebun1: req.body.TypeSeeds1,
            KetersediaanABmix1: req.body.ABmixAvailable1,
            KetersediaanJadamSulfur1: req.body.JasurAvailable1,
            KetersediaanArangSekamOrMetan1: req.body.MetanAvailable1,
            KutilangOrNot1: req.body.KutilangOrNot1,
            PPM1_1: req.body.firstPPM1,
            PPM2_1: req.body.secondPPM1,
            PPM3_1: req.body.thirdPPM1,
            PPM4_1: req.body.fourthPPM1,
            SprayJadam1_1: req.body.Jasur1_1,
            SprayPesNab1_1: req.body.Pesnab1_1,
            SprayJadam2_1: req.body.Jasur2_1,
            SprayPesNab2_1: req.body.Pesnab2_1,
            SprayJadam3_1: req.body.Jasur3_1,
            SprayPesNab3_1: req.body.Pesnab3_1,
            SprayJadam4_1: req.body.Jasur4_1,
            SprayPesNab4_1: req.body.Jasur4_1,
            ObatUlat1: req.body.CaterPiler1,
            UsiaPanendanKendala1: req.body.HarvestAge1,
            Rata_rataBb1: req.body.averageBB1,
            PembersihanPipa1: req.body.cleaningPipe1,
            DokProgress1: DokProg1,
          },
        ],

        Kebun2: [
          {
            TglSemai2: req.body.DateOfScatter2,
            JenisBibitKebun2: req.body.TypeSeeds2,
            KetersediaanABmix2: req.body.ABmixAvailable2,
            KetersediaanJadamSulfur2: req.body.JasurAvailable2,
            KetersediaanArangSekamOrMetan2: req.body.MetanAvailable2,
            KutilangOrNot2: req.body.KutilangOrNot2,
            PPM1_2: req.body.firstPPM2,
            PPM2_2: req.body.secondPPM2,
            PPM3_2: req.body.thirdPPM2,
            PPM4_2: req.body.fourthPPM2,
            SprayJadam1_2: req.body.Jasur1_2,
            SprayPesNab1_2: req.body.Pesnab1_2,
            SprayJadam2_2: req.body.Jasur2_2,
            SprayPesNab2_2: req.body.Pesnab2_2,
            SprayJadam3_2: req.body.Jasur3_2,
            SprayPesNab3_2: req.body.Pesnab3_2,
            SprayJadam4_2: req.body.Jasur4_2,
            SprayPesNab4_2: req.body.Jasur4_2,
            ObatUlat2: req.body.CaterPiler2,
            UsiaPanendanKendala2: req.body.HarvestAge2,
            Rata_rataBb2: req.body.averageBB2,
            PembersihanPipa2: req.body.cleaningPipe2,
            DokProgress2: DokProg2,
          },
        ],
        Kebun3: [
          {
            TglSemai3: req.body.DateOfScatter3,
            JenisBibitKebun3: req.body.TypeSeeds3,
            KetersediaanABmix3: req.body.ABmixAvailable3,
            KetersediaanJadamSulfur3: req.body.JasurAvailable3,
            KetersediaanArangSekamOrMetan3: req.body.MetanAvailable3,
            KutilangOrNot3: req.body.KutilangOrNot3,
            PPM1_3: req.body.firstPPM3,
            PPM2_3: req.body.secondPPM3,
            PPM3_3: req.body.thirdPPM3,
            PPM4_3: req.body.fourthPPM3,
            SprayJadam1_3: req.body.Jasur1_3,
            SprayPesNab1_3: req.body.Pesnab1_3,
            SprayJadam2_3: req.body.Jasur2_3,
            SprayPesNab2_3: req.body.Pesnab2_3,
            SprayJadam3_3: req.body.Jasur3_3,
            SprayPesNab3_3: req.body.Pesnab3_3,
            SprayJadam4_3: req.body.Jasur4_3,
            SprayPesNab4_3: req.body.Jasur4_3,
            ObatUlat3: req.body.CaterPiler3,
            UsiaPanendanKendala3: req.body.HarvestAge3,
            Rata_rataBb3: req.body.averageBB3,
            PembersihanPipa3: req.body.cleaningPipe3,
            DokProgress3: DokProg3,
          },
        ],
      });
      await post.save();
      // res.status(201).json({ message: "Post created", post });
      res.redirect("/display-hidro");
    } catch (err) {
      console.error("Upload failed:", err);
      res.status(500).json({ error: "Upload failed", details: err.message });
    }
  }
);
//how to display edit

router.get(
  "/edit-item-petak/:groupId/:elementId",
  authMiddleware,
  async (req, res) => {
    const { groupId, elementId } = req.params;

    try {
      const post = await MenTan.findById(groupId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Try to find in each array
      let item =
        post.Petak1.id(elementId) ||
        post.Petak2.id(elementId) ||
        post.Petak3.id(elementId);

      if (!item) {
        return res
          .status(404)
          .json({ message: "Item not found in any Produk array" });
      }

      // let penanda =
      //   item.ObatSuketAwal1 || item.ObatSuketAwal2 || item.ObatSuketAwal3;

      res.render("admin/editMentan", {
        data: item,
        // penanda,
        layout: layoutAdmin,
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error fetching nested item" });
    }
  }
);

router.get(
  "/edit-item-kebun/:groupId/:elementId",
  authMiddleware,
  async (req, res) => {
    const { groupId, elementId } = req.params;

    try {
      const post = await ManagementHidro.findById(groupId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Try to find in each array
      let item =
        post.Kebun1.id(elementId) ||
        post.Kebun2.id(elementId) ||
        post.Kebun3.id(elementId);

      if (!item) {
        return res
          .status(404)
          .json({ message: "Item not found in any Produk array" });
      }

      res.render("admin/editHidro", {
        data: item,
        // penanda,
        layout: layoutAdmin,
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error fetching nested item" });
    }
  }
);

router.put("/edit-item-kebun/:groupId", authMiddleware, async (req, res) => {
  const { groupId } = req.params;
  const {
    DateOfScatter,
    TypeSeeds,
    ABmixAvailable,
    JasurAvailable,
    MetanAvailable,
    KutilangOrNot,
    Measure1,
    Measure2,
    Measure3,
    Measure4,
    SprayJasur1,
    SprayPesnab1,
    SprayJasur2,
    SprayPesnab2,
    SprayJasur3,
    SprayPesnab3,
    SprayJasur4,
    SprayPesnab4,
    CaterPiler,
    HarvestAge,
    AverageBB,
    CleaningPipe,
  } = req.body;

  console.log(
    DateOfScatter,
    TypeSeeds,
    ABmixAvailable,
    JasurAvailable,
    MetanAvailable,
    KutilangOrNot,
    Measure1,
    Measure2,
    Measure3,
    Measure4,
    SprayJasur1,
    SprayPesnab1,
    SprayJasur2,
    SprayPesnab2,
    SprayJasur3,
    SprayPesnab3,
    SprayJasur4,
    SprayPesnab4,
    CaterPiler,
    HarvestAge,
    AverageBB,
    "request hidroponik"
  );

  try {
    const dataEdit = await ManagementHidro.findOne({
      $or: [
        { "Kebun1._id": groupId },
        { "Kebun2._id": groupId },
        { "Kebun3._id": groupId },
      ],
    });

    if (!dataEdit) {
      return res.status(404).json({ message: "Data not found" });
    }

    let updated = false;

    // Check Kebun1

    const kebun1Item = Array.isArray(dataEdit.Kebun1)
      ? dataEdit.Kebun1.find((p) => p._id.toString() === groupId.toString())
      : null;
    if (kebun1Item) {
      kebun1Item.TglSemai1 = DateOfScatter;
      kebun1Item.JenisBibitKebun1 = TypeSeeds;
      kebun1Item.KetersediaanABmix1 = ABmixAvailable;
      kebun1Item.KetersediaanJadamSulfur1 = JasurAvailable;
      kebun1Item.KetersediaanArangSekamOrMetan1 = MetanAvailable;
      kebun1Item.KutilangOrNot1 = KutilangOrNot;
      kebun1Item.PPM1_1 = Measure1;
      kebun1Item.PPM2_1 = Measure2;
      kebun1Item.PPM3_1 = Measure3;
      kebun1Item.PPM4_1 = Measure4;
      kebun1Item.SprayJadam1_1 = SprayJasur1;
      kebun1Item.SprayPesNab1_1 = SprayPesnab1;
      kebun1Item.SprayJadam2_1 = SprayJasur2;
      kebun1Item.SprayPesNab2_1 = SprayPesnab2;
      kebun1Item.SprayJadam3_1 = SprayJasur3;
      kebun1Item.SprayPesNab3_1 = SprayPesnab3;
      kebun1Item.SprayJadam4_1 = SprayJasur4;
      kebun1Item.SprayPesNab4_1 = SprayPesnab4;
      kebun1Item.ObatUlat1 = CaterPiler;
      kebun1Item.UsiaPanendanKendala1 = HarvestAge;
      kebun1Item.Rata_rataBb1 = AverageBB;
      kebun1Item.PembersihanPipa1 = CleaningPipe;
      updated = true;
    }

    // Check Kebun2
    const kebun2Item = Array.isArray(dataEdit.Kebun1)
      ? dataEdit.Kebun2.find((p) => p._id.toString() === groupId.toString())
      : null;
    if (kebun2Item) {
      kebun2Item.TglSemai2 = DateOfScatter;
      kebun2Item.JenisBibitKebun2 = TypeSeeds;
      kebun2Item.KetersediaanABmix2 = ABmixAvailable;
      kebun2Item.KetersediaanJadamSulfur2 = JasurAvailable;
      kebun2Item.KetersediaanArangSekamOrMetan2 = MetanAvailable;
      kebun2Item.KutilangOrNot2 = KutilangOrNot;
      kebun2Item.PPM1_2 = Measure1;
      kebun2Item.PPM2_2 = Measure2;
      kebun2Item.PPM3_2 = Measure3;
      kebun2Item.PPM4_2 = Measure4;
      kebun2Item.SprayJadam1_2 = SprayJasur1;
      kebun2Item.SprayPesNab1_2 = SprayPesnab1;
      kebun2Item.SprayJadam2_2 = SprayJasur2;
      kebun2Item.SprayPesNab2_2 = SprayPesnab2;
      kebun2Item.SprayJadam3_2 = SprayJasur3;
      kebun2Item.SprayPesNab3_2 = SprayPesnab3;
      kebun2Item.SprayJadam4_2 = SprayJasur4;
      kebun2Item.SprayPesNab4_2 = SprayPesnab4;
      kebun2Item.ObatUlat2 = CaterPiler;
      kebun2Item.UsiaPanendanKendala2 = HarvestAge;
      kebun2Item.Rata_rataBb2 = AverageBB;
      kebun2Item.PembersihanPipa2 = CleaningPipe;
      updated = true;
    }
    // Check Kebun3
    const kebun3Item = Array.isArray(dataEdit.Kebun3)
      ? dataEdit.Kebun3.find((p) => p._id.toString() === groupId.toString())
      : null;
    if (kebun3Item) {
      kebun3Item.TglSemai3 = DateOfScatter;
      kebun3Item.JenisBibitKebun3 = TypeSeeds;
      kebun3Item.KetersediaanABmix3 = ABmixAvailable;
      kebun3Item.KetersediaanJadamSulfur3 = JasurAvailable;
      kebun3Item.KetersediaanArangSekamOrMetan3 = MetanAvailable;
      kebun3Item.KutilangOrNot3 = KutilangOrNot;
      kebun3Item.PPM1_3 = Measure1;
      kebun3Item.PPM2_3 = Measure2;
      kebun3Item.PPM3_3 = Measure3;
      kebun3Item.PPM4_3 = Measure4;
      kebun3Item.SprayJadam1_3 = SprayJasur1;
      kebun3Item.SprayPesNab1_3 = SprayPesnab1;
      kebun3Item.SprayJadam2_3 = SprayJasur2;
      kebun3Item.SprayPesNab2_3 = SprayPesnab2;
      kebun3Item.SprayJadam3_3 = SprayJasur3;
      kebun3Item.SprayPesNab3_3 = SprayPesnab3;
      kebun3Item.SprayJadam4_3 = SprayJasur4;
      kebun3Item.SprayPesNab4_3 = SprayPesnab4;
      kebun3Item.ObatUlat3 = CaterPiler;
      kebun3Item.UsiaPanendanKendala3 = HarvestAge;
      kebun3Item.Rata_rataBb3 = AverageBB;
      kebun3Item.PembersihanPipa3 = CleaningPipe;
      updated = true;
    }
    console.log("groupId:", groupId);
    console.log("dataEdit:", dataEdit);
    console.log("Kebun1:", dataEdit.Kebun1);
    console.log("Kebun2:", dataEdit.Kebun2);
    console.log("Kebun3:", dataEdit.Kebun3);
    if (!updated) {
      return res.status(404).json({ message: "No matching product found" });
    }

    await dataEdit.save();

    // res.status(200).json({ dataEdit });
    res.redirect("/display-hidro");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete(
  "/delete-item1-kebun1/:postId/:itemId",
  authMiddleware,
  async (req, res) => {
    const { postId, itemId } = req.params;
    console.log(postId, itemId, "request delete kebun1 anda sampai");

    try {
      const updatedPost = await ManagementHidro.findByIdAndUpdate(
        postId,
        { $pull: { Kebun1: { _id: itemId } } },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.redirect("/display-hidro");
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error deleting nested item" });
    }
  }
);

router.delete("/delete-item1-kebun2/:postId/:itemId", async (req, res) => {
  const { postId, itemId } = req.params;
  console.log(postId, itemId, "request delete kebun 2 anda sampai");

  try {
    const updatedPost = await ManagementHidro.findByIdAndUpdate(
      postId,
      { $pull: { Kebun2: { _id: itemId } } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.redirect("/display-hidro");
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error deleting nested item" });
  }
});

router.delete("/delete-item1-kebun3/:postId/:itemId", async (req, res) => {
  const { postId, itemId } = req.params;
  console.log("DELETE kebun3 HIT", postId, itemId);

  try {
    const updatedPost = await ManagementHidro.findByIdAndUpdate(
      postId,
      { $pull: { Kebun3: { _id: itemId } } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.redirect("/display-hidro");
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error deleting nested item" });
  }
});




module.exports = router;
