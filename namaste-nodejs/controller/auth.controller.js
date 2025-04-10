const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const { users, question } = require("../model/index"); // Import users model from the database
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.renderHomePage = async (req, res) => {
  const data = await question.findAll({
    include: [
      {
        model: users,
        attributes: ["username"],
      },
    ],
  });
  console.log(data);
  res.render("home", { data }); // Render home.ejs
};

exports.renderRegisterPage = (req, res) => {
  res.render("./auth/register"); // Render register.ejs
};

exports.handleRegister = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return res.send("Please provide a username, email, and password");
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

    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Error registering user"); // Handle errors gracefully
  }
};

exports.renderLogin = (req, res) => {
  res.render("./auth/login"); // Render login.ejs
};

exports.handleLogin = async (req, res) => {
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
      // Fix here: using user.id instead of data.id
      const token = jwt.sign({ id: user.id }, "hahaha", {
        expiresIn: "30d",
      });
      res.cookie("jwtToken", token);
      res.redirect("/");
    } else {
      res.send("Invalid password");
    }
  } catch (error) {
    res.status(500).send("Error during login"); // Handle errors gracefully
  }
};

exports.renderForgotPasswordPage = (req, res) => {
  res.render("./auth/forgotPassword");
};

exports.handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  const data = await users.findAll({
    where: {
      email: email,
    },
  });
  if (data.length == 0) return res.send("No user reegestereed with that email");
  const otp = Math.floor(Math.random() * 1000) + 9999;
  // send otp to thaat email

  await sendEmail({
    email: email,
    subject: "Your reset passowrd OTP",
    text: `Your otp is ${otp}`,
  });
  data[0].otp = otp;
  await data[0].save();

  res.redirect("/verifyOtp");
};
exports.renderVerifyOtpPage = (req, res) => {
  res.render("./auth/verifyOtp");
};
