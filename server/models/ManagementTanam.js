const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostProducts = new Schema({
  Petak1: [
    {
      Tanggal_TanamPetak1: { type: String },
      Tgl_Pemupukan1: { type: Number },
      PupukVegetatifMakro: { type: Number },
      CompostTea: { type: Number },
      MediaBioChar: { type: String },
      PupukGeneratifMakro: { type: String },
      JadamSulfur: { type: String },
      ObatUlat: { type: String },
      PanenPetak1: { type: String },
      Dokumentasi: [
        {
          fileId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          filename: { type: String },
          fileType: { type: String },
          url: { type: String }, // e.g., local path or cloud URL
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  Produk2: [
    {
      NamaProduk2: { type: String },
      Harga2: { type: Number },
      Stok2: { type: Number },
      Keterangan2: { type: String },
      fileImages: [
        {
          fileId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          filename: { type: String },
          fileType: { type: String },
          url: { type: String }, // e.g., local path or cloud URL
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  Produk3: [
    {
      NamaProduk3: { type: String },
      Harga3: { type: Number },
      Stok3: { type: Number },
      Keterangan3: { type: String },
      fileImages: [
        {
          fileId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          filename: { type: String },
          fileType: { type: String },
          url: { type: String }, // e.g., local path or cloud URL
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],

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
});

module.exports = mongoose.model("PostAllProducts", PostProducts);
