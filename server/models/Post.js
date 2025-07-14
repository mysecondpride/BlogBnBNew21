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
<<<<<<< HEAD
      // files: [
      //   {
      //     fileId: {
      //       type: mongoose.Schema.Types.ObjectId,
      //     },
      //     filename: { type: String },
      //     fileType: { type: String },
      //     url: { type: String }, // e.g., local path or cloud URL
      //     uploadedAt: { type: Date, default: Date.now },
      //   },
      // ],
    },
  ],
=======
      files: [
        fileSchema
      ],
    },
  ],

  element2: [
    {
      body2: { type: String },

      files: [
       fileSchema
      ], // Embedding the file schema here
    },
  ],

  element3: [
    {
      body3: { type: String },
      url: { type: String },
      files: [
       fileSchema
      ], // Embedding the file schema here
    },
  ],

  element4: [
    {
      body4: { type: String },

      files: [
       fileSchema
      ], // Embedding the file schema here
    },
  ],

  penutup: [
    {
      penutup: { type: String },
    },
  ],

  // Embedding the file schema here
>>>>>>> c1086d8f0773ddd80fa9e649c3310998a8bd9b1d
});
module.exports = mongoose.model("Post", Post);
