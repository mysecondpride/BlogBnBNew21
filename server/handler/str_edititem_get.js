 exports.getEditItem= async (req, res) => {
    const { groupId, elementId } = req.params;

    try {
      const post = await PostProducts.findById(groupId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Try to find in each array
      let item =
        post.Produk1.id(elementId) ||
        post.Produk2.id(elementId) ||
        post.Produk3.id(elementId);

      if (!item) {
        return res
          .status(404)
          .json({ message: "Item not found in any Produk array" });
      }

      let productName =
        item.NamaProduk1 || item.NamaProduk2 || item.NamaProduk3;

      res.render("admin/edit-postdisplay", {
        data: item,
        productName,
        layout: layoutAdmin,
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error fetching nested item" });
    }
  }