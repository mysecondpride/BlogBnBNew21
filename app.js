#!/usr/bin/env node
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const {layoutMiddleware}=require("./server/controller/layOutMiddleware")


// const fs = require("fs");
const session = require("express-session");
const expressLayout = require("express-ejs-layouts");

//sitemap
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");

// connect;
const connectDB = require("./server/config/db");

// connectDB();

//Layouting

const methodOverride = require("method-override");

//path
const path = require("path");
// console.log("PATH IS:", path);


const PORT = process.env.PORT || 5000;

// bagaimana kita bisa mendapatkan data search tapi dengan aturan middleware?? berikut ini caranya
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use("/public", express.static("public"));

// Avoid this if /image is being served dynamically:
app.use(express.static("public")); // could block /image

// console.log("🔍 MONGODB_URI:", process.env.MONGODB_URI);
//penggunaan app.use yang memerlukan suatu middleware-- kalimat ini terinspirasi dari bugging
const startServer = async () => {
  await connectDB(); // tunggu sampai connect

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
      }),
    })
  );


};

startServer();
//templete engine
app.set("view engine", "ejs");
app.use(expressLayout);
app.set("layout", "layouts/main");
// app.set("views", path.join(__dirname, "views/bukan-admin"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//uploadaudio
app.use("/uploads", express.static("public/uploads"));

//publikasi
app.use(layoutMiddleware)

app.use(methodOverride(function (req, res) {
  if (req.query && req.query._method) {
    return req.query._method;
  }
}));
app.use(express.static("public")); //express.static()--is not middleware itself
app.use("/", require("./server/routes/admin"));
app.use("/", require("./server/routes/main"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
