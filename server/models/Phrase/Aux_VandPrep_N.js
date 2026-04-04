const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Auxiliary_Verb_Proposition_Verb = new Schema({
  Aux_Verb1: [
    {
      Aux_Verb1_Phrase: { type: String },
      Aux_Verb1_Audio: [
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
  Aux_Verb2_Phrase: [
    {
      Aux_Verb2_Phrase: { type: String },
      Aux_Verb2_Audio: [
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

  Aux_Verb3: [
    {
      Aux_Verb3_Phrase: { type: String },
      Aux_Verb3_Audio: [
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
  Aux_Verb4: [
    {
      Aux_Verb4_Phrase: { type: String },
      Aux_Verb4_Audio: [
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
  Prep_Noun1: [
    {
      Prep_Noun1_Phrase: { type: String },
      Prep_Noun1_Audio: [
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
  Prep_Noun2: [
    {
      Prep_Noun2_Phrase: { type: String },
      Prep_Noun2_Audio: [
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

  Prep_Noun3: [
    {
      Prep_Noun3_Phrase: { type: String },
      Prep_Noun3_Audio: [
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

  Prep_Noun4: [
    {
      Prep_Noun4_Phrase: { type: String },
      Prep_Noun4_Audio: [
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

module.exports = mongoose.model(
  "Auxiliary_Verb_Proposition_Verb",
  Auxiliary_Verb_Proposition_Verb
);
