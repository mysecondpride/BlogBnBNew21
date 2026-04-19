const mongoose=require('mongoose')
const PostProducts= require("../models/PostProducts")

exports.displayProducts=async (req, res) => {
  try {
    const data = await PostProducts.find({});
    console.log(data, "ini data produk");

    res.render("bukan-admin/tom's_store", {  data });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong while you are getting the products.",
    });
  }
}