const { QueryTypes } = require("sequelize");
const { users, question, answers, sequelize } = require("../model");

exports.renderAskQuestionPage = (req, res) => {
  res.render("question/askQuestion");
};

exports.askQuestion = async (req, res) => {
  const { title, description } = req.body;
  console.log("title", title, "description", description);
  console.log(req.body);
  console.log(req.file);

  const userId = req.userId;
  const fileName = req.file.filename;

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
  // Add a response here, for example:
  res.json(data);
};

exports.renderSingleQuestionPage = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await question.findAll({
      where: {
        id: id,
      },
      include: [
        {
          model: users,
          attributes: ["username"],
        },
      ],
    });

    let likes;
    let count = 0;

    try {
      likes = await sequelize.query(`SELECT * FROM likes_${id}`, {
        type: QueryTypes.SELECT,
      });

      if (likes.length) {
        count = likes.length;
      }
    } catch (err) {
      console.log(err);
    }

    // Fix: Changed 'question' to 'questionId' in the where clause
    const answerData = await answers.findAll({
      where: {
        questionId: id, // Changed from 'question' to 'questionId'
      },
      include: [
        {
          model: users,
          attributes: ["username"],
        },
      ],
    });

    res.render("./question/singleQuestion", {
      data,
      answers: answerData,
      likes: count,
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).send("Error loading question details");
  }
};
