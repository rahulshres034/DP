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

  const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP between 1000-9999
  // send otp to that email

  await sendEmail({
    email: email,
    subject: "Your reset passowrd OTP",
    text: `Your otp is ${otp}`,
  });
  data[0].otp = otp;
  data[0].otpGeneratedTime = Date.now();
  await data[0].save();

  res.redirect("/verifyOtp?email=" + email);
};
exports.renderVerifyOtpPage = (req, res) => {
  const email = req.query.email;
  res.render("./auth/verifyOtp", { email: email });
};

exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const email = req.params.id;

  const data = await users.findAll({
    where: {
      otp: otp,
      email: email,
    },
  });
  if (data.length === 0) {
    return res.send("Invalid Otp");
  }
  const currentTime = Date.now();
  const otpGeneratedTime = data[0].otpGeneratedTime;
  if (currentTime - otpGeneratedTime <= 120000) {
    res.redirect(`/resetPassword?email=${email}&otp=${otp}`);
  } else {
    res.send("OTP Expired");
  }
};

exports.renderResetPassword = async (req, res) => {
  const { email, otp } = req.query;
  if (!email || !otp) {
    return res.send("Please providee email,otp in query");
  }

  res.render("./auth/resetPassword", { email, otp });
};

// exports.handleResetPassword = async (req, res) => {
//   const { otp, email } = req.params;
//   const { newPassword, confirmPassword } = req.body;
//   if (!email || !newPassword || !confirmPassword) {
//     return res.send("Please provide email, otp, and pasasword");
//   }

//   if (newPassword !== confirmPassword) {
//     return res.send("New Password and Confirm Password does not match");
//   }
//   const userData = await users.findAll({
//     where: {
//       email,
//       otp,
//     },
//   });
//   const currentTime = Date.now();
//   const otpGeneratedTime = data[0].otpGeneratedTime;
//   if (currentTime - otpGeneratedTime <= 120000) {
//     await users.update(
//       {
//         password: bcrypt.hashSync(newPassword, 10),
//       },
//       {
//         where: {
//           email: email,
//         },
//       }
//     );
//     res.redirect("/login");
//   } else {
//     res.send("Otp Expired");
//   }
// };
exports.handleResetPassword = async (req, res) => {
  const { otp, email } = req.params;
  const { newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return res.send("Please provide email, otp, and password");
  }

  if (newPassword !== confirmPassword) {
    return res.send("New Password and Confirm Password does not match");
  }
  const userData = await users.findAll({
    where: {
      email,
      otp,
    },
  });

  // Fix this line - change data to userData
  const currentTime = Date.now();
  const otpGeneratedTime = userData[0].otpGeneratedTime;

  if (currentTime - otpGeneratedTime <= 120000) {
    await users.update(
      {
        password: bcrypt.hashSync(newPassword, 10),
      },
      {
        where: {
          email: email,
        },
      }
    );
    res.redirect("/login");
  } else {
    res.send("OTP Expired");
  }
};
