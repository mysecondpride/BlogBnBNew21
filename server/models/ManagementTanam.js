const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenTan = new Schema({
  Petak1: [
    {
      ObatSuketAwal1: { type: String },
      PengolahanLahanPetak1: { type: String },
      DolomitPetak1: { type: String },
      KetersediaanCompostTea_Jadam1: { type: String },
      KetersediaanCompostdanBio1: { type: String },
      JenisBibitPetak1: { type: String },
      MasukMediaBioChar1: { type: String },
      TanggalTanamPetak1: { type: Date },
      ObatSuket10Hari1: { type: String },
      KocorCompostTea1: { type: Number },
      JadamSulfur1: { type: String },
      ControlSuket1_1: { type: String },
      PenyiramanTahap1_1: { type: Date },
      TglPemupukan1_1: { type: Date },
      PupukVegetatifMakro1: { type: String },
      ControlSuket2_1: { type: String },
      PenyiramanTahap2_1: { type: Date },
      TglPemupukanGen1: { type: Date },
      PupukGeneratifMakro1: { type: String },
      ObatUlat1: { type: String },
      UsiaPanendanKendala1: { type: String },
      Rata_rataBb1: { type: String },
      DokProgress1: [
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
  Petak2: [
    {
      ObatSuketAwal2: { type: String },
      PengolahanLahanPetak2: { type: String },
      DolomitPetak2: { type: String },
      KetersediaanCompostTea_Jadam2: { type: String },
      KetersediaanCompostdanBio2: { type: String },
      JenisBibitPetak2: { type: String },
      MasukMediaBioChar2: { type: String },
      TanggalTanamPetak2: { type: Date },
      ObatSuket10Hari2: { type: String },
      KocorCompostTea2: { type: Number },
      JadamSulfur2: { type: String },
      ControlSuket1_2: { type: String },
      PenyiramanTahap1_2: { type: Date },
      TglPemupukan1_2: { type: Date },
      PupukVegetatifMakro2: { type: String },
      ControlSuket2_2: { type: String },
      PenyiramanTahap2_2: { type: Date },
      TglPemupukanGen2: { type: Date },
      PupukGeneratifMakro2: { type: String },
      ObatUlat2: { type: String },
      UsiaPanendanKendala2: { type: String },
      Rata_rataBb2: { type: String },
      DokProgress2: [
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
  Petak3: [
    {
      ObatSuketAwal3: { type: String },
      JenisBibitPetak3: { type: String },
      TanggalTanamPetak3: { type: Date },
      ObatSuket10Hari3: { type: String },
      JadamSulfur3: { type: String },
      TglPemupukan1_3: { type: Date },
      PupukVegetatifMakro3: { type: String },
      TglPemupukanGen3: { type: Date },
      PupukGeneratifMakro3: { type: String },
      ObatUlat3: { type: String },
      UsiaPanenPetak3: { type: String },
      Rata_rataBb3: { type: String },
    },
  ],
});

module.exports = mongoose.model("ManagemenTanam", MenTan);
