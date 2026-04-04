#!/usr/bin/env node
// require("dotenv").config({ path: "../../.env" });
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");

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

//connect to mongoDB
// const connect = require("./server/config/db");





const PORT = process.env.PORT || 3000;

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

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET, // Use an env variable (not hardcoded)
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//       client: mongoose.connection.getClient(),
//     }),
//   }),
// );

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGODB_URI,
//     }),
//   })
// );

// console.log("🔍 MONGODB_URI:", process.env.MONGODB_URI);
//templete engine

//penggunaan app.use yang memerlukan suatu middleware-- kalimat ini terinspirasi dari bugging
//layouting
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
};

startServer();






app.set("view engine", "ejs");
app.use(expressLayout);
app.set("layout", "layouts/main");
// app.set("views", path.join(__dirname, "views/bukan-admin"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//publikasi
app.use(express.static("public")); //express.static()--is not middleware itself
//request dan respond di pisahkan dalam suatu route





// app.use("/", require("./server/routes/admin"));
// app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));
// app.use("/admin", require("./server/routes/admin"));

// app.use((req, res, next) => {
//     if (req.originalUrl === "/favicon.ico") return next();
//   console.log("ini debug layout", {
//     url: req.originalUrl,
//     role: req.user?.role,
//     layout: res.locals.layout,
//   });
//   next();
// });


app.use("/", require("./server/routes/main"));

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
