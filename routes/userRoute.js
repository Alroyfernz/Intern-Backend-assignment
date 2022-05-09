const router = require("express").Router();
const userModel = require("../model/User");

router.post("/signup", async (req, res) => {
  const User = new userModel(req.body);
  try {
    const savedUser = await User.save();

    res.status(200).send(savedUser);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ Email: req.body.Email });
    if (!user)
      return res.status(404).json("No user found with the email address");
    const { attempts } = user;
    //check if lockin time is gretaer than 30 mins
    if (user.LockinTime != null) {
      const laterDate = user.LockinTime;
      const after = new Date(new Date(laterDate).getTime() + 1 * 60000);
      console.log(after.getMinutes());
      if (new Date().getTime() < after.getTime()) {
        return res.status(404).json("your account is locked for 30 mins..");
      }
    }
    user.attempts = 4;
    await user.save();

    if (user.Password !== req.body.Password) {
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
