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
const { getPostBlog, uploadImage } = require("../handler/blog_admin");
const { postBlog } = require("../handler/blog_admin");
const {sedap} = require("../../utils/gridFs"); // Import GridFS upload

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
const { logout } = require("../handler/logoutClear");

//variable untuk toko
const {displayProductsAdm}= require("../handler/str_displayproducts_get");
const { postDisplayProducts } = require("../handler/str_postdisplayproducts_post");
const {getPostDisplayProducts}= require("../handler/str_postdisplayproducts_get")
const {editPostDisplay}=require("../handler/str_editpostdisplay_put")


//delete-item
const{deleteItem1}=require("../handler/str_deleteitem1")
const{deleteItem2}=require("../handler/str_deleteitem2")
const{deleteItem3}=require("../handler/str_deleteitem3")


const{deleteImageProduct}= require("../handler/str_delete_image_product")
const { downloadImageProducts } = require("../handler/str_downloadImage");

//jurnal mushola

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
 sedap,
);

router.post("/post-display-products", authMiddleware,isAdmin,layoutMiddleware,   upload.fields([
    { name: "Produk1Files", maxCount: 10 },
    { name: "Produk2Files", maxCount: 1 },
    { name: "Produk3Files", maxCount: 1 },
  ]),postDisplayProducts)
router.post("/postblog", authMiddleware, isAdmin, layoutMiddleware, postBlog);
router.get(
  "/image/:id",
  upload.array("images"),
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
  // authMiddleware,
  // isAdmin,
  // layoutMiddleware,
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

router.delete(
  "/delete-image-profile",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  deleteImageProfile,
);
router.post(
  "/update-profile/:id",
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
// router untuk tom's store
router.get("/show-post-display", authMiddleware,isAdmin,layoutMiddleware,getPostDisplayProducts)
// router.post("/post-display-products",authMiddleware,isAdmin,layoutMiddleware,postDisplayProducts)
router.get("/display-products", authMiddleware, isAdmin, layoutMiddleware,displayProductsAdm)
router.post("/edit-post-display", authMiddleware, isAdmin,layoutMiddleware,editPostDisplay)

router.get('/files/:fileId', authMiddleware,isAdmin,layoutMiddleware,downloadImage)

router.post("/logout", authMiddleware,isAdmin,layoutMiddleware,logout)
module.exports = router;

//router untuk delete-item
router.delete("/delete-item1/:postId/:itemId", authMiddleware, isAdmin,layoutMiddleware,deleteItem1 )
router.delete("/delete-item2/:postId/:itemId", authMiddleware, isAdmin,layoutMiddleware,deleteItem2)
router.delete("/delete-item3/:postId/:itemId", authMiddleware, isAdmin,layoutMiddleware,deleteItem3)


//router untuk get image
router.get("/imagesofproducts/:postId/:fileId", downloadImageProducts)

//router untuk delete image
router.delete(
  "/delete-item-image/:produkKey/:postId/:fileId",
  authMiddleware,
  isAdmin,
  layoutMiddleware,
  deleteImageProduct
);


//jurnal mushola
const c = require("../handler/jurnalMusholla");
const uploadAudio = require("../handler/jurnalMusholla_uploadAudio");
const {deleteAudioOnly}= require("../handler/jurnalMusholla_deleteAudio")
router.get("/getToTheJurnal", authMiddleware,isAdmin,layoutMiddleware, c.index);
router.post("/add",authMiddleware,isAdmin,layoutMiddleware,uploadAudio.single("audio"), c.create);
router.get("/edit/:id", authMiddleware,isAdmin,layoutMiddleware,c.editForm);
router.post("/update/:id",authMiddleware,isAdmin,layoutMiddleware, c.update);
router.get("/delete/:id", authMiddleware,isAdmin,layoutMiddleware,c.remove);
router.delete("/delete-audio/:id",authMiddleware,isAdmin,layoutMiddleware,deleteAudioOnly);