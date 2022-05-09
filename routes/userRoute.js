const router = require("express").Router();
const userModel = require("../model/User");
const movieModel = require("../model/Movie");

const bcrypt = require("bcryptjs");
router.post("/signup", async (req, res) => {
  const { Favorites, ...User } = req.body;

  var fav = [];
  try {
    Favorites.map(async (item) => {
      console.log(item._id);
      fav.push(item._id);
      try {
        const movie = await movieModel.findOne({ _id: item._id });

        const newRating =
          (movie.AverageRatings * movie.NumberOfRatings + item.rating) /
          (movie.NumberOfRatings + 1);

        console.log("new rat", newRating);
        movie.AverageRatings = newRating;
        movie.NumberOfRatings++;
        await movie.save();
      } catch (error) {
        console.log(error.message);
      }
    });
    console.log(fav);

    const MainUser = new userModel(req.body);
    MainUser.Favorites = fav;
    const hashedPassword = await bcrypt.hash(MainUser.Password, 12);
    MainUser.Password = hashedPassword;
    const savedUser = await MainUser.save();

    res.status(200).send(savedUser);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await userModel
      .findOne({ Email: req.body.Email })
      .populate("Favorites");
    if (!user)
      return res.status(404).json("No user found with the email address");
    const { attempts } = user;
    //check if lockin time is gretaer than 30 mins
    if (user.LockinTime != null) {
      const laterDate = user.LockinTime;
      const after = new Date(new Date(laterDate).getTime() + 30 * 60000);
      //   console.log(after.getMinutes());
      if (new Date().getTime() < after.getTime()) {
        return res.status(404).json("your account is locked for 30 mins..");
      }
    }
    user.attempts = 4;
    await user.save();
    console.log(await bcrypt.compare(req.body.Password, user.Password));

    if (!(await bcrypt.compare(req.body.Password, user.Password))) {
      if (attempts - 1 <= 0) {
        //account lock for 30mins
        const currDate = new Date();
        user.LockinTime = currDate.toISOString();
        await user.save();
        return res
          .status(404)
          .json("account locked due to multiple incorrect passwords");
      } else {
        user.attempts = attempts - 1;
        await user.save();
        return res
          .status(404)
          .json(`Password mismatch ${attempts - 1} attempts remaining`);
      }
    }
    user.LockinTime = null;
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
module.exports = router;
