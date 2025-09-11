const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenTan = new Schema({
  TambulampotCabe1: [
    {
      OvenMediaTanam1: { type: String },
      DolomitPot1: { type: String },
      KetersediaanCompostTea_Jadam1: { type: String },
      KetersediaanCompostdanBio1: { type: String },
      JenisBibitCabe1: { type: String },
      Fertility1: { type: String },
      Moist1: { type: String },
      PH1: { type: String },
      Temp1: { type: String },
      Sunlight1: { type: String },
      Humidity1: { type: String },
      TanggalTanamPetak1: { type: Date },
      KocorCompostTea1: { type: Number },
      JadamSulfur1: { type: String },
      TglPemupukan1_1: { type: Date },
      PupukVegetatifMakro1: { type: String },
      TglPemupukanGen1: { type: Date },
      PupukGeneratifMakro1: { type: String },
      ObatTrip1: { type: String },
      RotasiObatTrip1: { type: String },
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
  TambulampotCabe2: [
    {
      OvenMediaTanam2: { type: String },
      DolomitPot2: { type: String },
      KetersediaanCompostTea_Jadam2: { type: String },
      KetersediaanCompostdanBio2: { type: String },
      JenisBibitCabe2: { type: String },
      Fertility2: { type: String },
      Moist2: { type: String },
      PH2: { type: String },
      Temp2: { type: String },
      Sunlight2: { type: String },
      Humidity2: { type: String },
      TanggalTanamPetak2: { type: Date },
      KocorCompostTea2: { type: Number },
      JadamSulfur2: { type: String },
      TglPemupukan1_2: { type: Date },
      PupukVegetatifMakro2: { type: String },
      TglPemupukanGen2: { type: Date },
      PupukGeneratifMakro2: { type: String },
      ObatTrip2: { type: String },
      RotasiObatTrip2: { type: String },
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
  TambulampotCabe3: [
    {
      OvenMediaTanam3: { type: String },
      DolomitPot3: { type: String },
      KetersediaanCompostTea_Jadam3: { type: String },
      KetersediaanCompostdanBio3: { type: String },
      JenisBibitPetak3: { type: String },
      Fertility3: { type: String },
      Moist3: { type: String },
      PH3: { type: String },
      Temp3: { type: String },
      Sunlight3: { type: String },
      Humidity3: { type: String },
      TanggalTanamPetak3: { type: Date },
      KocorCompostTea3: { type: Number },
      JadamSulfur3: { type: String },
      TglPemupukan1_3: { type: Date },
      PupukVegetatifMakro3: { type: String },
      TglPemupukanGen3: { type: Date },
      PupukGeneratifMakro3: { type: String },
      ObatTrip3: { type: String },
      RotasiObatTrip3: { type: String },
      UsiaPanendanKendala3: { type: String },
      Rata_rataBb3: { type: String },
      DokProgress3: [
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
});

module.exports = mongoose.model("ManagemenTanam", MenTan);
