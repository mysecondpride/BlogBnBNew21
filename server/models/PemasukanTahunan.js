const mongoose = require("mongoose");

const pengeluaranOptions = [
  "pendidikan",
  "infrastruktur",
  "operasional",
  "lain lain",
];

const pemasukanTahunanSchema = new mongoose.Schema(
  {
    no: { type: String, required: true, trim: true },
    bulan: { type: String, required: true, trim: true },
    pemasukan: { type: Number, required: true, default: 0 },
    rencanaProgramJangkaPanjang: { type: String, required: true, trim: true },
    pengeluaran: {
      type: [String],
      enum: pengeluaranOptions,
      default: [],
    },
    realisasiAnggaran: { type: Number, required: true, default: 0 },
    uraianRealisasi: { type: String, required: true, trim: true },
    saving: { type: Number, required: true, default: 0 },
  },
  { timestamps: true, collection: "pemasukanTahunan" }
);

module.exports = {
  PemasukanTahunan: mongoose.model("pemasukanTahunan", pemasukanTahunanSchema),
  pengeluaranOptions,
};
