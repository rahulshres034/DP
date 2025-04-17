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
const catchError = require("../utils/catchError");

const router = require("express").Router();
router
  .route("/register")
  .post(catchError(handleRegister))
  .get(renderRegisterPage);
router
  .route("/login")
  .get(catchError(renderLogin))
  .post(catchError(handleLogin));
router
  .route("/forgotPassword")
  .get(renderForgotPasswordPage)
  .post(handleForgotPassword);
router.route("/verifyOtp").get(renderVerifyOtpPage);
router.route("/verifyOtp/:id").post(verifyOtp);
router.route("/resetPassword").get(renderResetPassword);
router.route("/resetPassword/:email/:otp").post(handleResetPassword);
module.exports = router;
