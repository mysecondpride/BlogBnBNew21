const express = require("express");
const { getProfileVistior } = require("../handler_bukan_admin/profile");
const router = express.Router();
const { getPostedBlog } = require("../handler_bukan_admin/blog");
const {displayProducts}= require("../handler_bukan_admin/tom's_store");


router.get("/", getProfileVistior);
router.get("/blogvisitor", getPostedBlog);
router.get("/getTomStore",displayProducts)


module.exports = router;
