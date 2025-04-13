const {
  handleRegister,
  renderRegisterPage,
  handleLogin,
  renderLogin,
  renderForgotPasswordPage,
  renderVerifyOtpPage,
  handleForgotPassword,
  renderResetPassword,
  handleResetPassword,
  verifyOtp,
} = require("../controller/auth.controller");

const router = require("express").Router();
router.route("/register").post(handleRegister).get(renderRegisterPage);
router.route("/login").post(handleLogin).get(renderLogin);
router
  .route("/forgotPassword")
  .get(renderForgotPasswordPage)
  .post(handleForgotPassword);
router.route("/verifyOtp").get(renderVerifyOtpPage);
router.route("/verifyOtp/:id").post(verifyOtp);
router.route("/resetPassword").get(renderResetPassword);
router.route("/resetPassword/:email/:otp").post(handleResetPassword);
module.exports = router;
