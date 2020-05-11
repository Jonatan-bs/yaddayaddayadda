const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

module.exports = async (user) => {
  let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // Create jwt url and send mail
  try {
    let emailToken = await jwt.sign(
      {
        userId: user._id,
      },
      process.env.EMAIL_SECRET,
      {
        expiresIn: "10d",
      }
    );

    const url = `http://localhost:3000/user/confirmation/${emailToken}`;

    await transporter.sendMail({
      from: '"YaddaYaddaYadda" < ' + process.env.EMAIL_USERNAME + ">", // sender address
      to: user.email,
      subject: "Confirm Email",
      html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
    });
  } catch (err) {
    console.log("Mail error:", err);
    throw "Error sending confirmation mail";
  }
};
