const router = require("express").Router();
const { RegisterUser, LoginUser } = require("../controller/UserContorller");
const { USER_LOGIN, USER_REGISTER } = require("../helper/url_cons");
router.post(USER_REGISTER, RegisterUser);
router.post(USER_LOGIN, LoginUser);
module.exports = router;
