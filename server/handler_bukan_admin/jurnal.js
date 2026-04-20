
const Jurnal=require("../models/JurnalMusholla")
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
    res.render("bukan-admin/jurnalMusholla", { rows, selectedDate });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

exports.filterPerDate = async (req, res) => {
  try {
    const { tanggal } = req.query; // ✅ dari query

    if (!tanggal) {
      return res.send("Tanggal tidak ada");
    }

    const start = new Date(tanggal);
    const end = new Date(tanggal);
    end.setDate(end.getDate() + 1);

    const rows = await Jurnal.find({
      tanggal: {
        $gte: start,
        $lt: end,
      },
    }).sort({ tanggal: 1 });
    // res.json({rows})

    res.render("bukan-admin/jurnalM_filter", { rows, selectedDate: tanggal});
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
};