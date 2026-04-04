const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VerbTransitif_VerbIntransitif = new Schema({
  Verb_Noun1: [
    {
      Verb_Noun1_Phrase: { type: String },
      Verb_Noun1_Audio: [
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
  Verb_Noun2: [
    {
      Verb_Noun2_Phrase: { type: String },
      Verb_Noun2_Audio: [
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

  Verb_Noun3: [
    {
      Verb_Noun3_Phrase: { type: String },
      Verb_Noun3_Audio: [
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
  Verb_Noun4: [
    {
      Verb_Noun4_Phrase: { type: String },
      Verb_Noun4_Audio: [
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
  Verb_Intransitive1: [
    {
      Verb_Intransitive1: { type: String },
      Verb_Intransitive1_Audio: [
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
  Verb_Intransitive2: [
    {
      Verb_Intransitive2: { type: String },
      Verb_Intransitive2_Audio: [
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
  Verb_Intransitive3: [
    {
      Verb_Intransitive3: { type: String },
      Verb_Intransitive3_Audio: [
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
  Verb_Intransitive4: [
    {
      Verb_Intransitive4: { type: String },
      Verb_Intransitive4_Audio: [
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

module.exports = mongoose.model("DoubleWord", VerbTransitif_VerbIntransitif);
