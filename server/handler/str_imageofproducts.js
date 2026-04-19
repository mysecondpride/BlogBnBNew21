exports.imageOfProducts= async (req, res) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });

  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const stream = bucket.openDownloadStream(fileId);
    stream.pipe(res);
  } catch (err) {
    res.status(404).send("Image not found");
  }
}