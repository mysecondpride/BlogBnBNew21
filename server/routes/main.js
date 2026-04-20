const express = require("express");
const { getProfileVistior } = require("../handler_bukan_admin/profile");
const router = express.Router();
const { getPostedBlog } = require("../handler_bukan_admin/blog");
const {displayProducts}= require("../handler_bukan_admin/tom's_store");
const {filterPerDate}= require("../handler_bukan_admin/jurnal")
const c = require("../handler_bukan_admin/jurnal");


router.get("/", getProfileVistior);
router.get("/blogvisitor", getPostedBlog);
router.get("/getTomStore",displayProducts)
router.get("/jurnalVisitor", c.index);
router.get("/filter-per-date",filterPerDate)



module.exports = router;
