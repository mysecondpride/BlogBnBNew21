const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  filename: { type: String, required: true },
  fileType: { type: String }, // e.g., image/png, application/pdf
  url: { type: String }, // e.g., local path or cloud URL
  uploadedAt: { type: Date, default: Date.now },
});

// Define the post schema
const Post = new Schema({
  customId: {
    type: String,
    unique: true,
    required: true,
  },

  element1: [
    {
      title: { type: String },
      content: { type: String },
      url: { type: String },
    },
  ],
});
module.exports = mongoose.model("Post", Post);
