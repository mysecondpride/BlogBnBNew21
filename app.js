#!/usr/bin/env node
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
// const fs = require("fs");

//sitemap
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");

// connect;
const connectDB = require("./server/config/db");
require("dotenv").config();
connectDB();

//Layouting
const expressLayout = require("express-ejs-layouts");
//cookie parser--agar tidak dosol dalam nginput username dan password. Ia juga berpasangan dengan session
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const User = require("./server/models/User");

//connect to mongoDB
// const connect = require("./server/config/db");

const app = express();
const PORT = 3000;

//maintanance.
const isMaintenanceMode = process.env.MAINTENANCE === "true";
// bagaimana kita bisa mendapatkan data search tapi dengan aturan middleware?? berikut ini caranya
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(bodyParser.json());

app.use("/public", express.static("public"));

// Avoid this if /image is being served dynamically:
app.use(express.static("public")); // could block /image

//session, session ini mengandung logic, ini adalah basic
// app.use(
//   session({
//     secret: "keybord cat",
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URI,
//     }),
//   })
// );

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use an env variable (not hardcoded)
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // Match Railway’s environment variable name
      dbName: "blogBnB", // Optional but recommended
      collectionName: "posts", // Optional (default: "sessions")
    }),
  })
);

//templete engine

//penggunaan app.use yang memerlukan suatu middleware-- kalimat ini terinspirasi dari bugging
//layouting
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

//publikasi
app.use(express.static("public")); //express.static()--is not middleware itself

//request dan respond di pisahkan dalam suatu route
app.use("/", require("./server/routes/admin"));
app.use("/", require("./server/routes/main"));

app.use((req, res, next) => {
  if (isMaintenanceMode && req.url !== "/maintenance") {
    return res.redirect("/maintenance");
  }
  next();
});

//sitemap
app.get("/sitemap.xml", async (req, res) => {
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

const seedUsers = async () => {
  try {


    const existingUser = await User.findOne({ username: "BudiSiswo" });
    if (existingUser) {
      console.log("User BudiSiswo already exists. Skipping seeding...");
      return;
    }
    
    const users = [
      {
        username: "Alexandro",
        password: await bcrypt.hash("admin@123", 12),
      },
      {
        username: "BudiSiswo",
        password: await bcrypt.hash("2017101071989Bud!030107215Bud!", 12),
      },
    ];

    await User.insertMany(users);
    console.log("Users seeded successfully");
  } catch (err) {
    console.error("Seeder Error:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedUsers();


app.listen(PORT, "0.0.0.0", () => {
  console.log(`success to connect to the ${PORT}`);
});
