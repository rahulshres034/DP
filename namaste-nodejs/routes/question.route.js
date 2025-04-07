const {
  renderAskQuestionPage,
  askQuestion,
  renderSingleQuestionPage,
} = require("../controller/question.controller");
const { isAuthenticated } = require("../middleware/isAuthenticated.middleware");
const { multer, storage } = require("../middleware/multerConfig.middleware");
const router = require("express").Router();
const upload = multer({ storage: storage });

router
  .route("/askQuestion")
  .get(isAuthenticated, renderAskQuestionPage)
  .post(isAuthenticated, upload.single("image"), askQuestion);

router.route("/question/:id").get(renderSingleQuestionPage);

module.exports = router;
