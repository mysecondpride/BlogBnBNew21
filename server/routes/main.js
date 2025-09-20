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

router.get("/promo", (req, res) => {
  res.render("landing"); // akan render views/landing.ejs
});

router.get("/", async (req, res) => {
  const locals = {
    title:
      "Lumbung Pangan | Jual Tepung Garut dan Ubi Garut, Jelarut, Kirut, Jual Umbi Garut (arrowroot) dan Tepung Garut",
    description:
      " Jual Umbi Garut, Ubi Garut, Kirut dan tepung garut, tepung pati garut, jengkirut, irut, Gresik, Surabaya, Sidoarjo",
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
    title:
      "Lumbung Pangan | Jual Ubi Garut, Jelarut, irut, jengkirut, tepung pati garut,jual tepung garut ",
    description:
      "Jual Ubi Garut, Irut, Jengkirut, Jual Ubi garut, Jelarut, Ararut,tepung garut,tepung pati garut, irut, surabaya, gresik, sidoarjo ",
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

    const smStream = new SitemapStream({
      hostname: "https://suppliersayuranhidroponik.my.id",
    });

    // langsung pipe ke response
    smStream.pipe(res);

    const blogs = await Post.find();
    blogs.forEach((blog) => {
      smStream.write({
        url: blog.slug ? `/post/${blog.slug}` : `/post/${blog._id}`,
        changefreq: "daily",
        priority: 0.9,
      });
    });

    const posts = await PostProducts.find();
    posts.forEach((post) => {
      smStream.write({
        url: post.slug ? `/post/${post.slug}` : `/post/${post._id}`,
        changefreq: "daily",
        priority: 1.0,
      });
    });

    smStream.end();
  } catch (e) {
    console.error("Sitemap generation error:", e);
    res.status(500).end();
  }
});

// const blogs = await Post.find();
// blogs.forEach((blog) => {
//   if (blog.slug && blog.slug.trim() !== "") {
//     smStream.write({
//       url: `/post/${blog.slug}`,
//       changefreq: "daily",
//       priority: 0.9,
//     });
//   } else {
//     // fallback jika hanya ada _id
//     smStream.write({
//       url: `/post/${blog._id}`,
//       changefreq: "daily",
//       priority: 0.9,
//     });
//   }
// });


router.use((req, res, next) => {
  res.status(404).render("404"); // This renders views/404.ejs
});

module.exports = router;
