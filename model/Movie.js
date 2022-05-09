const { Schema, model } = require("mongoose");
const Movieschema = new Schema({
  Name: {
    Type: String,
  },
  Description: {
    type: String,
    required: true,
  },
  AverageRatings: {
    type: Number,
    default: 0,
  },
  NumberOfRatings: {
    type: Number,
    default: 0,
  },
});

module.exports = new model("Movie", Movieschema);
