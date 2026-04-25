const fs = require("fs");
const path = require("path");
const Jurnal = require("../models/JurnalMusholla");

exports.deleteAudioOnly = async (req, res) => {
  try {
    const { id } = req.params;

    const jurnal = await Jurnal.findById(id);
    if (!jurnal) return res.send("Data tidak ditemukan");

    if (jurnal.audio && jurnal.audio.path) {
      const filePath = path.join(
        process.cwd(),
        "public",
        jurnal.audio.path // 🔥 langsung pakai path dari DB
      );

      console.log("PATH YANG DIHAPUS:", filePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("FILE TERHAPUS");
      } else {
        console.log("FILE TIDAK DITEMUKAN");
      }
    }

    // kosongkan audio di DB
    jurnal.audio = null;
    await jurnal.save();

    res.redirect("/getToTheJurnal");
  } catch (err) {
    res.status(500).send(err.message);
  }
};