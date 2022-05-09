const movieModel = require("../model/Movie");
const userModel = require("../model/User");
const bcrypt = require("bcryptjs");

const RemainingTime = (currDate, futureDate) => {
  var diff = futureDate - currDate;
  return Math.floor(diff / 1000 / 60);
};

const RegisterUser = async (req, res) => {
  const { Favorites, ...Rest } = req.body;

  var Favorite_id = [];
  try {
    Favorites.map(async (item) => {
      console.log(item._id);
      Favorite_id.push(item._id);
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

    const User = new userModel(req.body);
    User.Favorites = Favorite_id;
    const hashedPassword = await bcrypt.hash(User.Password, 12);
    User.Password = hashedPassword;
    const SavedUser = await User.save();

    res
      .status(200)
      .send({ message: "User Registration Succesfull", data: SavedUser });
  } catch (error) {
    res.status(404).send({
      message: "Error while Registering an User",
      message: error.message,
    });
  }
};

const LoginUser = async (req, res) => {
  try {
    const user = await userModel
      .findOne({ Email: req.body.Email })
      .populate("Favorites");
    if (!user)
      return res.status(404).json({
        message: `No user found with the given Email:${req.body.Email}`,
      });
    const { attempts } = user;
    //check if lockin time exists which means user has entered wrong password more than 4 times
    if (user.LockinTime != null) {
      const lockedDate = user.LockinTime;
      const after = new Date(new Date(lockedDate).getTime() + 30 * 60000); //date after 30 mins
      if (new Date().getTime() < after.getTime()) {
        return res.status(404).json({
          message: `Due to incorrect trials your account has been locked, Try after ${RemainingTime(
            lockedDate,
            after
          )} `,
        });
      }
    }
    user.attempts = 4;
    await user.save();

    if (!(await bcrypt.compare(req.body.Password, user.Password))) {
      if (attempts - 1 <= 0) {
        //account lock for 30mins
        const currDate = new Date();
        user.LockinTime = currDate.toISOString();
        await user.save();
        return res.status(404).json({
          message: "Account locked due to multiple incorrect passwords",
        });
      } else {
        user.attempts = attempts - 1;
        await user.save();
        return res.status(404).json({
          message: `Password mismatch ${attempts - 1} attempts remaining`,
        });
      }
    }
    user.LockinTime = null; //remove the lockin time if successfull login
    await user.save();
    return res
      .status(200)
      .json({ message: "User Logged in Succesfully", data: user });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  RegisterUser,
  LoginUser,
};
