const mongoose = require("mongoose");

const jurnalSchema = new mongoose.Schema(
  {
    tanggal: { type: Date, required: true },
    materi: { type: String, required: true },
    homework: { type: String },
    catatanOrtu: { type: String },
    audio: {
  type: String,
}
  },
  { timestamps: true, collection: "jurnalMusholla" }
);

module.exports = mongoose.model("jurnalMusholla", jurnalSchema);