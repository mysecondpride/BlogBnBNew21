const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Profile = new Schema({
  customId: { type: "string", unique: true },

  element1: {
    title: {
      type: "String",
    },

    content: {
      type: "string",
    },
  },
});

module.exports = mongoose.model("profile", Profile);
