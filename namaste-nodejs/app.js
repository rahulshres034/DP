const express = require("express"); // Import Express framework
const app = express(); // Create an Express application
const { users, answers, sequelize } = require("./model/index"); // Import users model from the database
const { promisify } = require("util");
const session = require("express-session");
const flash = require("connect-flash");
const jwt = require("jsonwebtoken");
const socketio = require("socket.io");
const { QueryTypes } = require("sequelize");

// Set the view engine to EJS for rendering dynamic HTML files
app.set("view engine", "ejs");

// Middleware to serve static CSS files from the "public/css" directory
app.use(express.static("./storage/"));
app.use("/storage", express.static("storage"));
app.use(express.static("public/css/"));
const cookieParser = require("cookie-parser");

// Middleware to parse URL-encoded request bodies (form submissions)
app.use(express.urlencoded({ extended: true }));
// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "thisissecretforsession",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use(async (req, res, next) => {
  const token = req.cookies.jwtToken;
  try {
    const decryptedResult = await promisify(jwt.verify)(token, "hahaha");
    if (decryptedResult) {
      res.locals.isAuthenticated = true;
    } else {
      res.locals.isAuthenticated = false;
    }
  } catch (error) {
    res.locals.isAuthenticated = false;
  }
  next();
});

require("./model/index"); // Ensure database models are loaded
const authRoute = require("./routes/auth.routes");
const questionRoute = require("./routes/question.route");
const answerRoute = require("./routes/answer.routes");

const { renderHomePage } = require("./controller/auth.controller");

app.get("/", renderHomePage);
// Route: Handle User Auth
app.use("/", authRoute);
app.use("/", questionRoute);
app.use("/answer", answerRoute);

// Start the Express server on port 3000
const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // In app.js, update the socket.on('like') handler:
  socket.on("like", async ({ answerId, cookie }) => {
    const answer = await answers.findByPk(answerId);
    if (answer && cookie) {
      try {
        // Use cookie instead of undefined token
        const decryptedResult = await promisify(jwt.verify)(cookie, "hahaha");
        if (decryptedResult) {
          try {
            // Check if likes table exists, if not create it
            await sequelize.query(
              `CREATE TABLE IF NOT EXISTS likes_${answerId} (
              id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
              userId INT NOT NULL
            )`,
              {
                type: QueryTypes.RAW,
              }
            );

            // Check if user already liked
            const user = await sequelize.query(
              `SELECT * FROM likes_${answerId} WHERE userId=${decryptedResult.id}`,
              {
                type: QueryTypes.SELECT,
              }
            );

            if (user.length === 0) {
              await sequelize.query(
                `INSERT INTO likes_${answerId} (userId) VALUES(${decryptedResult.id})`,
                {
                  type: QueryTypes.INSERT,
                }
              );
            }

            const likes = await sequelize.query(
              `SELECT * FROM likes_${answerId}`,
              {
                type: QueryTypes.SELECT,
              }
            );

            const likesCount = likes.length;
            // Update the answer with the like count
            await answer.update({
              likes: likesCount,
            });

            // Emit to all clients, not just the socket
            io.emit("likeUpdate", { likesCount, answerId });
          } catch (error) {
            console.error("Database error:", error);
          }
        }
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }
  });
});
