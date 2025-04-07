const express = require("express"); // Import Express framework
const app = express(); // Create an Express application
const { users } = require("./model/index"); // Import users model from the database
const { promisify } = require("util");

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
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
