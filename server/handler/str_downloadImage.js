const mongoose= require("mongoose");
const GridFSBucket= require("mongodb");

// exports.downloadImageProducts= async (req, res) => {
//   const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//     bucketName: "fs",
//   });

//   try {
//     const fileId = new mongoose.Types.ObjectId(req.params.fileId);
//     const stream = bucket.openDownloadStream(fileId);
//     stream.pipe(res);
//   } catch (err) {
//     res.status(404).send("Image not found");
//   }
// }

exports.downloadImageProducts = async (req, res) => {
  const bucket = new mongoose.mongo.GridFSBucket(
    mongoose.connection.db,
    { bucketName: "fs" }
  );

  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    const stream = bucket.openDownloadStream(fileId);

    stream.on("error", (err) => {
      console.error("GridFS error:", err.message);
      if (!res.headersSent) {
        res.status(404).send("Image not found");
      }
    });

    stream.on("file", (file) => {
      res.set("Content-Type", file.contentType || "image/jpeg");
    });

    stream.pipe(res);
  } catch (err) {
    res.status(404).send("Invalid image id");
  }
};