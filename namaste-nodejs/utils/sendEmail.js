const nodemailer = require("nodemailer");
const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rahulshres034@gmail.com",
      pass: "nleyhajcyigbdafa",
    },
  });

  const mailOption = {
    from: "Namaste <raahulshres034@gmail.com",
    to: data.email,
    subject: data.subject,
    text: data.text,
  };

  await transporter.sendMail(mailOption);
};

module.exports = sendEmail;
