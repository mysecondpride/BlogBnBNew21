//connect to database
require("dotenv").config();

//penghubung router
const express = require("express");
const router = express.Router();

// router penghubung ke package dan model
const mongoose = require("mongoose");

//perobaan layout di main
// const layOut = require(".");
//schema yang diperlukan:
//Schema post
const Post = require("../models/Post");
const PostProducts = require("../models/PostProducts");

// const Grid = require("gridfs-stream");

const { GridFSBucket } = require("mongodb");

//how to connect to mongoDB with string
const conn = mongoose.createConnection(process.env.MONGODB_URI);

//Making a global variable
let gfs;


// Bagaimana ketika connect dengan database bisa langsung tertuju pada collection
conn.once("open", function () {
  const bucket = new GridFSBucket(conn.db, {
    bucketName: "upload", // <-- equivalent to gfs.collection('upload')
  });

  // Now you use bucket to upload/download files
});

router.get("/maintenance", (req, res) => {
  res.send("<h1>Website is under maintenance. Please come back later.</h1>");
});

router.get("/", async (req, res) => {
  const locals = {
    title:
      "Supplier Sayuran Hidroponik Surabaya Sidoarjo WalikDamenNesia, Jual Sayur Hidroponik Surabaya Sidoarjo ongkir flat",
    description:
      " Jual sayuran hidroponik surabaya sidoarjo, supplier sayuran hidroponik surabaya sidoarjo,Salada Lettuce | Salada Keriting | Sawi Packcoy | Sawi Samhong | Bumbu dapur",
  };

  try {
    const data = await PostProducts.find({});
    res.render("index", { data, locals });
  } catch (err) {
    console.error(err);
  }
});
router.get("/blog", async (req, res) => {
  const locals = {
    title: "Supplier Sayuran Hidroponik Surabaya Sidoarjo WalikDameNesia",
    description:
      "Salada Lettuce | Salada Keriting | Sawi Packcoy | Sawi Samhong | Bumbu dapur ",
  };
  // router ini untuk melempar data yang sudah kita post
  let perPage = 200;
  let page = req.query.page || 1;
  const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

  const count = await Post.countDocuments();
  const nextPage = parseInt(page) + 1;
  const hasNextPage = nextPage <= Math.ceil(count / perPage);
  res.render("blog", {
    locals,
    data,
    current: page,
    nextPage: hasNextPage ? nextPage : null,
  });
});

router.post("/search", async (req, res) => {
  const keyword = req.body.searchTerm;

  // Prevent $regex error if input is missing or not a string
  if (!keyword || typeof keyword !== "string") {
    return res.render("search-result", { results: [], keyword: "" });
  }

  try {
    const results = await PostProducts.find({
      $or: [
        {
          Produk1: {
            $elemMatch: {
              NamaProduk1: { $regex: keyword, $options: "i" },
            },
          },
        },
        {
          Produk2: {
            $elemMatch: {
              NamaProduk2: { $regex: keyword, $options: "i" },
            },
          },
        },
        {
          Produk3: {
            $elemMatch: {
              NamaProduk3: { $regex: keyword, $options: "i" },
            },
          },
        },
      ],
    });

    res.render("search", { results, keyword });
  } catch (error) {
    console.error(error);
    res.status(500).send("Search failed");
  }
});
router.get("/about", (req, res) => {
  res.render("about");
});
router.get("/post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Post.findById(id); // 🟢 This uses the _id
    console.log(data, " ini adalah data");

    res.render("post-article", { data });
  } catch (error) {
    console.log("error", error);
  }
});

router.use((req, res, next) => {
  res.status(404).render("404"); // This renders views/404.ejs
});

module.exports = router;
