const router = require("express").Router();
const movieModel = require("../model/Movie");
router.post("/addMovie", async (req, res) => {
  try {
    const newMovie = new movieModel(req.body);
    await newMovie.save();
    return res.status(200).json("Movie saved succesfully");
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

router.post("/editMovie/:id", async (req, res) => {
  try {
    const movie = await movieModel.findOne({ _id: req.params.id });
    const { rating } = req.body;
    const newRating =
      (movie.AverageRatings * movie.NumberOfRatings + rating) /
      (movie.NumberOfRatings + 1);

    console.log("new rat", newRating);
    movie.AverageRatings = newRating;
    movie.NumberOfRatings++;
    await movie.save();
    return res.json("movie rating updated");
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

module.exports = router;
