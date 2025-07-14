//connect to database
require("dotenv").config();

//penghubung router
const express = require("express");
const router = express.Router();

// router penghubung ke package dan model
const mongoose = require("mongoose");

//sitemap
const { SitemapStream, streamToPromise } = require("sitemap")
const { createGzip } = require("zlib");
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
      "Lumbung Pangan | Supplier Sayuran Hidroponik Surabaya Sidoarjo , Jual Sayur Hidroponik Surabaya Sidoarjo ongkir flat",
    description:
      " Jual sayuran hidroponik Surabaya Sidoarjo, supplier sayuran hidroponik surabaya sidoarjo,Salada Lettuce | Salada Keriting | Sawi Pakcoy|Jamur Tiram | Sawi Samhong | Bumbu dapur",
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
    title: "Lumbung Pangan | Supplier Sayuran Hidroponik Surabaya Sidoarjo ",
    description:
      "Salada Lettuce | Salada Keriting | Sawi Pakcoi | Sawi Samhong | Bumbu dapur ",
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
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    const contentBlock =
      post.element1 && post.element1.length > 0
        ? post.element1[0]
        : { title: "", content: "" };

    res.render("post-article", {
      title: contentBlock.title,
      content: contentBlock.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//sitemap
router.get("/sitemap.xml", async (req, res) => {
  try {
    res.header("Content-Type", "application/xml");
    res.header("Content-Encoding", "gzip");

    const smStream = new SitemapStream({
      hostname: "https://suppliersayuranhidroponik.my.id",
    });
    const pipeline = smStream.pipe(createGzip());

    // Write only PUBLIC routes from your main site
    smStream.write({ url: "/", changefreq: "daily", priority: 1.0 });
    smStream.write({ url: "/about", changefreq: "monthly", priority: 0.7 });
    smStream.write({ url: "/blog", changefreq: "weekly", priority: 0.8 });

    // Optional: include dynamic pages (e.g., posts, products)
    const posts = await PostProducts.find();
    posts.forEach((post) => {
      smStream.write({
        url: `/post/${post.slug}`,
        changefreq: "daily",
        priority: 1.0,
      });
    });

    smStream.end();
    const sitemapOutput = await streamToPromise(pipeline);
    res.send(sitemapOutput);
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
});


router.use((req, res, next) => {
  res.status(404).render("404"); // This renders views/404.ejs
});

module.exports = router;
