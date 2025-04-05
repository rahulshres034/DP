const { users, question } = require("../model");

exports.renderAskQuestionPage = (req, res) => {
  res.render("question/askQuestion");
};

exports.askQuestion = async (req, res) => {
  const { title, description } = req.body;
  console.log("title", title, "description", description);
  console.log(req.body);
  console.log(req.file);

  const userId = req.userId;
  const fileName = req.file.filename; // Changed 'fileName' to 'filename'

  if (!title || !description) {
    return res.send("Please provide title, description");
  }

  await question.create({
    title,
    description,
    image: fileName,
    userId,
  });
  res.redirect("/");
};

exports.getAllQuestion = async (req, res) => {
  const data = await question.findAll({
    include: [
      {
        model: users,
      },
    ],
  });
};
