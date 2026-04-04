const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Expression = new Schema({
  theThreeExpression: [
    {
      CommonExpression: {
        type: { String },
        meaning: { String },
      },
      Slank: {
        type: { String },
        meaning: { String },
      },
      Idiom: {
        type: { String },
        meaning: { String },
      },
    },
  ],
});
module.exports = mongoose.model("Expression", Expression);
