const Jurnal = require("../models/JurnalMusholla");
const fs = require("fs");
const path = require("path");

// helper: awal & akhir hari (untuk filter tanggal)
function dayRange(dateStr) {
  const start = new Date(dateStr);
  start.setHours(0, 0, 0, 0);
  const end = new Date(dateStr);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// LIST + SEARCH by tanggal
exports.index = async (req, res) => {
  try {
    let filter = {};
    let selectedDate = "";

    if (req.query.tanggal) {
      selectedDate = req.query.tanggal;
      const { start, end } = dayRange(selectedDate);
      filter.tanggal = { $gte: start, $lte: end };
    }

    const rows = await Jurnal.find(filter).sort({ tanggal: -1 });
    res.render("admin/jurnalMusholla", { rows, selectedDate });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const { tanggal, materi, homework, catatanOrtu } = req.body;

    const audio = req.file ?  {
      filename: req.file.filename,
      path: `/uploads/audio/${req.file.filename}`,
    }
  : null;

    await Jurnal.create({
      tanggal,
      materi,
      homework,
      catatanOrtu,
      audio,
    });

    res.redirect("/getToTheJurnal");
  } catch (e) {
    res.status(500).send(e.message);
  }
};
// EDIT form
exports.editForm = async (req, res) => {
  try {
    const row = await Jurnal.findById(req.params.id);
    res.render("admin/jurnalMusholla_edit", { row });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const jurnal = await Jurnal.findById(req.params.id);
    if (!jurnal) return res.send("Data tidak ditemukan");

    let audio = jurnal.audio; // default pakai yang lama

    // kalau upload file baru
    if (req.file) {
      // hapus file lama
      if (jurnal.audio && jurnal.audio.filename) {
        const oldPath = path.join(
          process.cwd(),
          "public/uploads/audio",
          jurnal.audio.filename
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // simpan file baru
      audio = {
        filename: req.file.filename,
        path: `/uploads/audio/${req.file.filename}`,
      };
    }

    await Jurnal.findByIdAndUpdate(req.params.id, {
      tanggal: req.body.tanggal,
      materi: req.body.materi,
      homework: req.body.homework,
      catatanOrtu: req.body.catatanOrtu,
      audio: audio,
    });

    res.redirect("/getToTheJurnal");
  } catch (e) {
    res.status(500).send(e.message);
  }
};
// DELETE
exports.remove = async (req, res) => {
  try {
    await Jurnal.findByIdAndDelete(req.params.id);
    res.redirect("/getToTheJurnal");
  } catch (e) {
    res.status(500).send(e.message);
  }
};