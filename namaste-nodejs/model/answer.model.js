module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define("answer", {
    answerText: {
      type: DataTypes.TEXT, // Changed to TEXT for longer answers
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
  return Answer;
};
