exports.editPostDisplay= async (req, res) => {
  const { groupId } = req.params;
  const { ProductName, Price, Stock } = req.body;

  try {
    const dataEdit = await PostProducts.findOne({
      $or: [
        { "Produk1._id": groupId },
        { "Produk2._id": groupId },
        { "Produk3._id": groupId },
      ],
    });

    if (!dataEdit) {
      return res.status(404).json({ message: "Data not found" });
    }

    let updated = false;

    // Check Produk1
    const produk1Item = dataEdit.Produk1.find(
      (p) => p._id.toString() === groupId
    );
    if (produk1Item) {
      produk1Item.NamaProduk1 = ProductName;
      produk1Item.Harga1 = Price;
      produk1Item.Stok1 = Stock;
      updated = true;
    }

    // Check Produk2
    const produk2Item = dataEdit.Produk2.find(
      (p) => p._id.toString() === groupId
    );
    if (produk2Item) {
      produk2Item.NamaProduk2 = ProductName;
      produk2Item.Harga2 = Price;
      produk2Item.Stok2 = Stock;
      updated = true;
    }

    // Check Produk3
    const produk3Item = dataEdit.Produk3.find(
      (p) => p._id.toString() === groupId
    );
    if (produk3Item) {
      produk3Item.NamaProduk3 = ProductName;
      produk3Item.Harga3 = Price;
      produk3Item.Stok3 = Stock;
      updated = true;
    }

    if (!updated) {
      return res.status(404).json({ message: "No matching product found" });
    }

    await dataEdit.save();

    res.status(200).json({ dataEdit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}