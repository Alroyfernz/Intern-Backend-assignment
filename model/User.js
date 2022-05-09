const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const UserSchema = new Schema({
  FullName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  LockinTime: { type: String },
  attempts: { type: Number, default: 4 },
  Password: {
    type: String,
    required: true,
  },
  Age: {
    type: Number,
  },
  Favorites: [
    {
      ref: "Movie",
      type: ObjectId,
    },
  ],
});

module.exports = model("User", UserSchema);
