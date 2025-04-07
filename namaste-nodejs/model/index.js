const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");

// la sequelize yo config haru lag ani database connect gardey vaneko hae
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port: 3308,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("CONNECTED!!");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// importing model files

db.users = require("./userModel.js")(sequelize, DataTypes);
db.question = require("./question.model.js")(sequelize, DataTypes);
db.answers = require("./answer.model.js")(sequelize, DataTypes);

// 2. Associations (Relationships):
db.users.hasMany(db.question);
// - This line defines a one-to-many relationship: one user can have many questions.
// - In the database, this typically results in a foreign key (e.g., 'userId') in the 'questions' table
//   that references the primary key of the 'users' table.

db.question.belongsTo(db.users);
// - This line defines the inverse of the previous relationship: one question belongs to one user.
// - It reinforces the foreign key relationship and provides methods for querying related data.

db.question.hasMany(db.answers);
// - This line defines a one-to-many relationship: one question can have many answers.
// - A foreign key (e.g., 'questionId') in the 'answers' table will reference the 'questions' table.

db.answers.belongsTo(db.question);
// - This line defines the inverse of the previous relationship: one answer belongs to one question.
// - It reinforces the foreign key relationship.

db.users.hasMany(db.answers);
// - This line defines a one-to-many relationship: one user can have many answers.
// - A foreign key (e.g., 'userId') in the 'answers' table will reference the 'users' table.
// - This relation means that users can directly answer questions.

db.answers.belongsTo(db.users);
// - This line defines the inverse of the previous relationship: one answer belongs to one user.
// - It reinforces the foreign key relationship.

// Summary:
// This code establishes a database schema with three tables: 'users', 'questions', and 'answers'.
// It defines the relationships between these tables:
// - Users can ask many questions.
// - Questions can have many answers.
// - Users can provide many answers.
// These relationships allow for efficient querying and manipulation of related data within the application.
// The duplicate assignment to `db.questions` is a potential error.

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done");
});

module.exports = db;
