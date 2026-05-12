const {
  PemasukanTahunan,
  pengeluaranOptions,
} = require("../models/PemasukanTahunan");
const PemasukanTahunanTitle = require("../models/PemasukanTahunanTitle");

const PER_PAGE = 20;
const TITLE_KEY = "pemasukan-tahunan";

function parseRupiah(value) {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const cleaned = String(value)
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function normalizePengeluaran(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function buildPayload(body) {
  return {
    no: body.no,
    bulan: body.bulan,
    pemasukan: parseRupiah(body.pemasukan),
    rencanaProgramJangkaPanjang: body.rencanaProgramJangkaPanjang,
    pengeluaran: normalizePengeluaran(body.pengeluaran),
    realisasiAnggaran: parseRupiah(body.realisasiAnggaran),
    uraianRealisasi: body.uraianRealisasi,
    saving: parseRupiah(body.saving),
  };
}

async function getTitle() {
  const title = await PemasukanTahunanTitle.findOneAndUpdate(
    { key: TITLE_KEY },
    { $setOnInsert: { key: TITLE_KEY, title: "Tabel Pemasukan Tahun" } },
    { new: true, upsert: true }
  );

  return title.title;
}

async function getPaginatedRows(query) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const totalRows = await PemasukanTahunan.countDocuments();
  const rows = await PemasukanTahunan.find({})
    .sort({ bulan: -1, createdAt: -1 })
    .skip((page - 1) * PER_PAGE)
    .limit(PER_PAGE);

  return {
    rows,
    page,
    totalPages: Math.max(Math.ceil(totalRows / PER_PAGE), 1),
  };
}

exports.index = async (req, res) => {
  try {
    const [title, paginatedRows] = await Promise.all([
      getTitle(),
      getPaginatedRows(req.query),
    ]);

    res.render("admin/pemasukanTahunan", {
      title,
      pengeluaranOptions,
      formatRupiah,
      editData: null,
      ...paginatedRows,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.create = async (req, res) => {
  try {
    await PemasukanTahunan.create(buildPayload(req.body));
    res.redirect("/pemasukan-tahun");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.editForm = async (req, res) => {
  try {
    const [title, paginatedRows, editData] = await Promise.all([
      getTitle(),
      getPaginatedRows(req.query),
      PemasukanTahunan.findById(req.params.id),
    ]);

    if (!editData) return res.status(404).send("Data tidak ditemukan");

    res.render("admin/pemasukanTahunan", {
      title,
      pengeluaranOptions,
      formatRupiah,
      editData,
      ...paginatedRows,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.update = async (req, res) => {
  try {
    await PemasukanTahunan.findByIdAndUpdate(
      req.params.id,
      buildPayload(req.body),
      { runValidators: true }
    );
    res.redirect("/pemasukan-tahun");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    await PemasukanTahunan.findByIdAndDelete(req.params.id);
    res.redirect("/pemasukan-tahun");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateTitle = async (req, res) => {
  try {
    const title = req.body.title || "Tabel Pemasukan Tahun";

    await PemasukanTahunanTitle.findOneAndUpdate(
      { key: TITLE_KEY },
      { key: TITLE_KEY, title },
      { upsert: true, runValidators: true }
    );

    res.redirect("/pemasukan-tahun");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
