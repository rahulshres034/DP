const { handleAnswer } = require("../controller/answer.controller");
const { isAuthenticated } = require("../middleware/isAuthenticated.middleware");

const router = require("express").Router();

router.route("/:id").post(isAuthenticated, handleAnswer);

module.exports = router;
