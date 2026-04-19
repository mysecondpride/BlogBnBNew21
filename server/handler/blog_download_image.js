const { ObjectId, GridFSBucket } = require('mongodb');
const mongoose= require ('mongoose')
exports.downloadImage = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db);

    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid file id");
    }

    const _id = new ObjectId(id);

    const file = await db.collection("fs.files").findOne({ _id });
    if (!file) {
      return res.status(404).send("File not found");
    }

    res.set("Content-Type", file.contentType || "image/jpeg");

    bucket.openDownloadStream(_id).pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};