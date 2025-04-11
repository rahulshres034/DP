const {
  handleRegister,
  renderRegisterPage,
  handleLogin,
  renderLogin,
  renderForgotPasswordPage,
  renderVerifyOtpPage,
  handleForgotPassword,
} = require("../controller/auth.controller");

const router = require("express").Router();
router.route("/register").post(handleRegister).get(renderRegisterPage);
router.route("/login").post(handleLogin).get(renderLogin);
router
  .route("/forgotPassword")
  .get(renderForgotPasswordPage)
  .post(handleForgotPassword);
router.route("/verifyOtp").get(renderVerifyOtpPage);
module.exports = router;
