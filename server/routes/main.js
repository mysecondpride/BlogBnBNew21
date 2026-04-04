const express = require("express");
const { getProfileforVistior } = require("../handler_bukan_admin/profile");
const router = express.Router();
const { getPostedBlog } = require("../handler_bukan_admin/blog");

router.get("/", getProfileforVistior);
router.get("/blog", getPostedBlog);

module.exports = router;
