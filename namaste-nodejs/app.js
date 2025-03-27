const express = require("express");
const { users } = require("./model/index");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public/css/")); // Serve static files from the public directory

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./model/index");
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  await users.create({
    email,
    password,
    username,
  });

  res.send("Register successfully");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
