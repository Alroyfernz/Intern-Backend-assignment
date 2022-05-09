const movieModel = require("../model/Movie");

const CreateMovie = async (req, res) => {
  console.log(req.body);
  try {
    const newMovie = new movieModel(req.body);
    const Movie = await newMovie.save();
    return res
      .status(200)
      .json({ message: "Movie saved succesfully", data: Movie });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const EditMovie = async (req, res) => {
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
    return res.json({ message: "Movie Rating Updated Successfully" });
  } catch (error) {
    return res.status(404).json({
      message: `Error while updating caused  due to ${error.message}`,
    });
  }
};
const FetchMovie = async (req, res) => {
  const { term } = req.query;
  try {
    const movie = await movieModel.find({
      MovieName: { $regex: term, $options: "i" },
    });
    return res.status(200).json({
      message: "Movies Fetched Successfully",
      data: movie,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error while fetching movies due to ${error.message}` });
  }
};

module.exports = {
  CreateMovie,
  EditMovie,
  FetchMovie,
};
