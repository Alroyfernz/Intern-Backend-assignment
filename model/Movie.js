const { Schema, model } = require("mongoose");
const MovieSchema = new Schema({
  MovieName: {
    type: String,
    // required: true,
  },
  Description: {
    type: String,
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

module.exports = new model("Movie", MovieSchema);
