const {
  handleRegister,
  renderRegisterPage,
  handleLogin,
  renderLogin,
} = require("../controller/auth.controller");

const router = require("express").Router();
router.route("/register").post(handleRegister).get(renderRegisterPage);
router.route("/login").post(handleLogin).get(renderLogin);

module.exports = router;
