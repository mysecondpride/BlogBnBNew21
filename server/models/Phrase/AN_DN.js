const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Adjective_Noun_Determiner_Noun = new Schema({
  Adjective_Noun1: [
    {
      Adj_N1_Phrase: { type: String },
      Adj_N1_Phrase_Audio: [
        {
          fileId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          filename: { type: Audio },
          fileType: { type: String },
          url: { type: String }, // e.g., local path or cloud URL
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  Adjective_Noun2: [
    {
      Adj_N2_Phrase: { type: String },
      Adj_N2_Audio: [
        {
          fileId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          filename: { type: Audio },
          fileType: { type: String },
          url: { type: String }, // e.g., local path or cloud URL
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],

  Adjective_Noun3: [
    {
      Adj_N3_Phrase: { type: String },
      Adj_N3_Audio: [
        {
          fileId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          filename: { type: Audio },
          fileType: { type: String },
          url: { type: String }, // e.g., local path or cloud URL
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  Adjective_Noun4: [
    {
      Adj_N4_Phrase: { type: String },
      Adj_N4_Audio: [
        {
          fileId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          filename: { type: Audio },
          fileType: { type: String },
          url: { type: String }, // e.g., local path or cloud URL
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  Determiner_Noun1: [
    {
      Det_N1_Phrase: { type: String },
      Det_N2_Phrase: [
        {
          fileId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          filename: { type: Audio },
          fileType: { type: String },
          url: { type: String }, // e.g., local path or cloud URL
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  Determiner_Noun2: [
    {
      Det_N2_Phrase: { type: String },
      Det_N2_Audio: [
        {
          fileId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          filename: { type: Audio },
          fileType: { type: String },
          url: { type: String }, // e.g., local path or cloud URL
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  Determiner_Noun3: [
    {
      Det_N3_Phrase: { type: String },
      Det_N3_Audio: [
        {
          fileId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          filename: { type: Audio },
          fileType: { type: String },
          url: { type: String }, // e.g., local path or cloud URL
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  Determiner_Noun4: [
    {
      Det_N4_Phrase: { type: String },
      Det_N4_Audio: [
        {
          fileId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          filename: { type: Audio },
          fileType: { type: String },
          url: { type: String }, // e.g., local path or cloud URL
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("AN_DN", Adjective_Noun_Determiner_Noun);
