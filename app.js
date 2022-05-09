require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/UserRoute");
const movieRoute = require("./routes/MovieRoute");

const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGO_URL, () => {
  console.log("connection to database successful");
});
app.use("/user", userRoute);
app.use("/movie", movieRoute);
app.listen(process.env.PORT, () => {
  console.log(`server listening on PORT ${process.env.PORT}`);
});
