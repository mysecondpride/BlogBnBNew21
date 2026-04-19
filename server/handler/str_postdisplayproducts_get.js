 const mongoose=require('mongoose')
 const PostProducts= require("../models/PostProducts")
 
 exports.getPostDisplayProducts= async (req, res) => {
  try {
    const data = await PostProducts.find({});

    res.render("admin/display-products-post", { data});
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong while creating the blog post.",
    });
  }
}