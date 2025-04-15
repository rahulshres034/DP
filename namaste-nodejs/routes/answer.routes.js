const { handleAnswer } = require("../controller/answer.controller");
const { isAuthenticated } = require("../middleware/isAuthenticated.middleware");
const catchError = require("../utils/catchAsync");
const router = require("express").Router();

router.route("/:id").post(isAuthenticated, catchError(handleAnswer));

module.exports = router;
