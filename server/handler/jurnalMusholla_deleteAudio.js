const fs = require("fs");
const path = require("path");
const Jurnal = require("../models/JurnalMusholla");

exports.deleteAudioOnly = async (req, res) => {
  try {
    const { id } = req.params;

    const jurnal = await Jurnal.findById(id);
    if (!jurnal) return res.send("Data tidak ditemukan");

    if (jurnal.audio) {
      const filePath = path.join(
        process.cwd(), // 🔥 ROOT PROJECT
        "public",
        "uploads",
        "audio",
        jurnal.audio
      );

      console.log("PATH YANG DIHAPUS:", filePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("FILE TERHAPUS");
      } else {
        console.log("FILE TIDAK DITEMUKAN");
      }
    }

    jurnal.audio = null;
    await jurnal.save();

    res.redirect("/getToTheJurnal");
  } catch (err) {
    res.status(500).send(err.message);
  }
};