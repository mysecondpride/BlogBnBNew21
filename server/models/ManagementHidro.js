const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ManagementHidro = new Schema({
  Kebun1: [
    {
      TglSemai1: { type: Date },
      JenisBibitKebun1: { type: String },
      KetersediaanABmix1: { type: String },
      KetersediaanJadamSulfur1: { type: String },
      KetersediaanArangSekamOrMetan1: { type: String },
      KutilangOrNot1: { type: String },
      PPM1_1: { type: Number },
      PPM2_1: { type: Number },
      PPM3_1: { type: Number },
      PPM4_1: { type: Number },
      SprayJadam1_1: { type: Date },
      SprayPesNab1_1: { type: Date },
      SprayJadam2_1: { type: Date },
      SprayPesNab2_1: { type: Date },
      SprayJadam3_1: { type: Date },
      SprayPesNab3_1: { type: Date },
      SprayJadam4_1: { type: Date },
      SprayPesNab4_1: { type: Date },
      ObatUlat1: { type: String },
      UsiaPanendanKendala1: { type: String },
      Rata_rataBb1: { type: String },
      PembersihanPipa1: { type: String },
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

  Kebun2: [
    {
      TglSemai2: { type: Date },
      JenisBibitKebun2: { type: String },
      KetersediaanABmix2: { type: String },
      KetersediaanJadamSulfur2: { type: String },
      KetersediaanArangSekamOrMetan2: { type: String },
      KutilangOrNot2: { type: String },
      PPM1_2: { type: Number },
      PPM2_2: { type: Number },
      PPM3_2: { type: Number },
      PPM4_2: { type: Number },
      SprayJadam1_2: { type: Date },
      SprayPesNab1_2: { type: Date },
      SprayJadam2_2: { type: Date },
      SprayPesNab2_2: { type: Date },
      SprayJadam3_2: { type: Date },
      SprayPesNab3_2: { type: Date },
      SprayJadam4_2: { type: Date },
      SprayPesNab4_2: { type: Date },
      ObatUlat2: { type: String },
      UsiaPanendanKendala2: { type: String },
      Rata_rataBb2: { type: String },
      PembersihanPipa2: { type: String },
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

  Kebun3: [
    {
      TglSemai3: { type: Date },
      KetersediaanABmix3: { type: String },
      KetersediaanJadamSulfur3: { type: String },
      KetersediaanArangSekamOrMetan3: { type: String },
      KutilangOrNot3: { type: String },
      UsiaPanen3: { type: String },
      JenisBibitKebun3: { type: String },
      PPM1_3: { type: Number },
      PPM2_3: { type: Number },
      PPM3_3: { type: Number },
      PPM4_3: { type: Number },
      SprayJadam1_3: { type: Date },
      SprayPesNab1_3: { type: Date },
      SprayJadam2_3: { type: Date },
      SprayPesNab2_3: { type: Date },
      SprayJadam3_3: { type: Date },
      SprayPesNab3_3: { type: Date },
      SprayJadam4_3: { type: Date },
      SprayPesNab4_3: { type: Date },
      ObatUlat3: { type: String },
      UsiaPanendanKendala3: { type: String },
      Rata_rataBb3: { type: String },
      PembersihanPipa3: { type: String },
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

module.exports = mongoose.model("ManagementHidro", ManagementHidro);
