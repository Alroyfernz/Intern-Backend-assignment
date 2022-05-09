const router = require("express").Router();
const {
  CreateMovie,
  EditMovie,
  FetchMovie,
} = require("../controller/MovieController");

const { CREATE_MOVIE, EDIT_MOVIE, FETCH_MOVIE } = require("../helper/url_cons");
router.post(CREATE_MOVIE, CreateMovie);

router.post(EDIT_MOVIE, EditMovie);

router.get(FETCH_MOVIE, FetchMovie);

module.exports = router;
