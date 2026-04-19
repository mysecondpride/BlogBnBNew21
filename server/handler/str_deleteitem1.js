  const PostProducts=require("../models/PostProducts")
  
  exports.deleteItem1= async (req, res) => {
    const { postId, itemId } = req.params;

    console.log(postId, itemId, "postId dan ItemId 1 yang dicari");
    

    try {
      const updatedPost = await PostProducts.findByIdAndUpdate(
        postId,
        { $pull: { Produk1: { _id: itemId } } },
        { new: true }

      );

      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      

      res.redirect("/display-products");
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error deleting nested item" });
    }
  }