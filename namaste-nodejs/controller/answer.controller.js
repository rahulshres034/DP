const { answers } = require("../model");

exports.handleAnswer = async (req, res) => {
  try {
    const userId = req.userId;
    const { answer } = req.body;
    const { id: questionId } = req.params;

    await answers.create({
      answerText: answer,
      userId,
      questionId,
    });

    // Fix: Fixed typo in redirect URL
    res.redirect(`/question/${questionId}`);
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).send("Error submitting your answer");
  }
};
