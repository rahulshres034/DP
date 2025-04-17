const { QueryTypes } = require("sequelize");
const { answers, sequelize } = require("../model");

// exports.handleAnswer = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { answer } = req.body;
//     const { id: questionId } = req.params;

//     const data = await answers.create({
//       answerText: answer,
//       userId,
//       questionId,
//     });

//     console.log("From Answer Controller", data);

//     await sequelize.query(
//       `CREATE TABLE likes_${data.id} (
//       id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
//       userId INT NOT NULL REFRENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
//       )`,
//       {
//         type: QueryTypes.CREATE,
//       }
//     );
//     // Fix: Fixed typo in redirect URL
//     res.redirect(`/question/${questionId}`);
//   } catch (error) {
//     console.error("Error submitting answer:", error);
//     res.status(500).send("Error submitting your answer");
//   }
// };
// In controller/answer.controller.js
exports.handleAnswer = async (req, res) => {
  try {
    const userId = req.userId;
    const { answer } = req.body;
    const { id: questionId } = req.params;

    const data = await answers.create({
      answerText: answer,
      userId,
      questionId,
    });

    console.log("From Answer Controller", data);

    // Fix the syntax and use IF NOT EXISTS to prevent errors
    await sequelize.query(
      `CREATE TABLE IF NOT EXISTS likes_${data.id} (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL
      )`,
      {
        type: QueryTypes.RAW, // Use RAW for CREATE TABLE
      }
    );

    res.redirect(`/question/${questionId}`);
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).send("Error submitting your answer");
  }
};
