require("dotenv").config();
const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
app.use(express.json());
const userRoute = require("./routes/userRoute");
mongoose.connect(process.env.MONGO_URL, () => {
  console.log("connection to database successful");
});
app.use("/user", userRoute);
app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
