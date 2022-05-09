const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  FullName: {
    type: String,
  },
  Email: {
    type: String,
  },
  LockinTime: { type: String },
  attempts: { type: Number },
  Password: {
    type: String,
  },
  Age: {
    type: Number,
  },
  Favorites: [
    {
      name: {
        type: String,
      },
      rating: {
        type: Number,
      },
    },
  ],
});

module.exports = model("User", UserSchema);
