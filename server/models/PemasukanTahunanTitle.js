const mongoose = require("mongoose");

const pemasukanTahunanTitleSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "pemasukan-tahunan",
    },
    title: {
      type: String,
      required: true,
      default: "Tabel Pemasukan Tahun",
      trim: true,
    },
  },
  { timestamps: true, collection: "pemasukanTahunanTitle" }
);

module.exports = mongoose.model(
  "pemasukanTahunanTitle",
  pemasukanTahunanTitleSchema
);
