const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the post schema
const Post = new Schema({
  customId: {
    type: String,
    unique: true,
    // required: true,
  },

  element1: [
    {
      title: { type: String },
      content: { type: String },
      // url: { type: String }
      images: [{ fileId: { type: mongoose.Schema.Types.ObjectId } }],
    },
  ],
});
module.exports = mongoose.model("Post", Post);
