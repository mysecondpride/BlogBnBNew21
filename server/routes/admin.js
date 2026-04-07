const express = require("express");
const cheerio = require("cheerio");
const cookies = require("cookie-parser");
const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json()); // ← WAJIB untuk fetch JSON
// const layoutAdmin = "../server/views/layouts/admin";

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const User = "../routes/models/User";
//how to connect by connection string

const { succeedRegister } = require("../controller/succeedRegister");
const { getRegister } = require("../handler/getRegister");
const authMiddleware = require("../controller/authMiddleware");
const { authLogin } = require("../controller/login");
const { layoutMiddleware } = require("../controller/layOutMiddleware");
const Post = require("../models/Post");
const { isAdmin } = require("../controller/isAdmin");
const { getPostBlog } = require("../handler/blog_admin");
const { postBlog } = require("../handler/blog_admin");
const uploads = require("../../utils/gridFs"); // Import GridFS upload

const { downloadImage } = require("../handler/blog_download_image");
const upload = require("../handler/blog_upload_image");
const { getTheBlogDashboard } = require("../handler/dashboard");
//profile
const {
  postProfile,
  getPostedProfile,
  deleteImageProfile,
  editProfile,
  getEditProfile,
  getPostProfile,
} = require("../handler/profile");
const { getEachArticle } = require("../handler/blog_admin");
const { getEditBlog } = require("../handler/blog_admin");
const { updateBlog } = require("../handler/blog_admin");
const { deleteImage } = require("../handler/blog_delete_image_gridFS");
const { deleteBlog } = require("../controller/login");

router.get("/go_to_the_dashboard", getRegister);
router.post("/register", succeedRegister);
router.post("/login", authLogin, authMiddleware);
router.get(
  "/dashboard",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  getTheBlogDashboard,
);
router.get(
  "/blog",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  getTheBlogDashboard,
);
router.get(
  "/getsummernote",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  getPostBlog,
);
router.post(
  "/upload-image",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  upload.array("images"),
  uploads.sedap,
);
router.post("/postblog", authMiddleware, isAdmin, layoutMiddleware, postBlog);
router.get(
  "/image/:id",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  downloadImage,
);
router.get(
  "/getPostProfile",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  getPostProfile,
);
router.post(
  "/postProfile",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  postProfile,
);
router.get(
  "/eachArticle/:id",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  getEachArticle,
);
router.get(
  "/edit-postBlog/:id",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  getEditBlog,
);
router.post(
  "/update-blog/:id",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  updateBlog,
);
router.delete(
  "/delete-image",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  deleteImage,
);
router.post(
  "/edit-profile",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  editProfile,
);
router.get(
  "/getEditProfile/:id",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  getEditProfile,
);
router.get(
  "/getPostedProfile",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  getPostedProfile,
);
router.delete(
  "/delete-blog/:id",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  deleteBlog,
);
module.exports = router;
