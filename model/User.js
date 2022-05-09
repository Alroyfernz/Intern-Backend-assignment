const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  FullName: {
    type: String,
    required: true,
  },
  Age: {
    type: Number,
    required: true,
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
