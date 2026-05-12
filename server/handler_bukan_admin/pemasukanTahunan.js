const { PemasukanTahunan } = require("../models/PemasukanTahunan");
const PemasukanTahunanTitle = require("../models/PemasukanTahunanTitle");

const PER_PAGE = 20;

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

exports.index = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const [titleData, totalRows, rows] = await Promise.all([
      PemasukanTahunanTitle.findOne({ key: "pemasukan-tahunan" }),
      PemasukanTahunan.countDocuments(),
      PemasukanTahunan.find({})
        .sort({ bulan: -1, createdAt: -1 })
        .skip((page - 1) * PER_PAGE)
        .limit(PER_PAGE),
    ]);

    res.render("bukan-admin/pemasukanTahunan", {
      title: titleData ? titleData.title : "Tabel Pemasukan Tahun",
      rows,
      page,
      totalPages: Math.max(Math.ceil(totalRows / PER_PAGE), 1),
      formatRupiah,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
