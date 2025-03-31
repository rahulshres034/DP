const express = require("express"); // Import Express framework
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const { users } = require("./model/index"); // Import users model from the database

const app = express(); // Create an Express application
const jwt = require("jsonwebtoken");
// Set the view engine to EJS for rendering dynamic HTML files
app.set("view engine", "ejs");

// Middleware to serve static CSS files from the "public/css" directory
app.use(express.static("public/css/"));

// Middleware to parse URL-encoded request bodies (form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse incoming JSON requests
app.use(express.json());

require("./model/index"); // Ensure database models are loaded

// Route: Home Page
app.get("/", (req, res) => {
  res.render("home"); // Render home.ejs
});

// Route: About Page
app.get("/about", (req, res) => {
  res.render("about"); // Render about.ejs
});

// Route: Registration Page
app.get("/register", (req, res) => {
  res.render("register"); // Render register.ejs
});

// Route: Handle User Registration
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return res.send("Please provide a username, email, and password");
  }

  const user = await users.findOne({ where: { email } });

  if (!user) {
    return res.send("No user found with that email");
  }

  try {
    // Hash the password before saving it
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user record in the database
    await users.create({
      email,
      password: hashedPassword,
      username,
    });

    res.send("Registered successfully");
  } catch (error) {
    res.status(500).send("Error registering user"); // Handle errors gracefully
  }
});

// Route: Login Page
app.get("/login", (req, res) => {
  res.render("login"); // Render login.ejs
});

// Route: Handle User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.send("Please provide an email and password");
  }

  try {
    // Find user by email
    const user = await users.findOne({ where: { email } });

    if (!user) {
      return res.send("No user found with that email");
    }

    // Compare entered password with stored hashed password
    const isMatched = bcrypt.compareSync(password, user.password);

    if (isMatched) {
      const token = jwt.sign({ id: data.id }, "haha", {
        expiresIn: "30d",
      });
      res.cookie("jwtToken", token);
      res.send("Logged in successfully");
    } else {
      res.send("Invalid password");
    }
  } catch (error) {
    res.status(500).send("Error during login"); // Handle errors gracefully
  }
});

// Start the Express server on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
