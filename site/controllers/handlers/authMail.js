const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

module.exports = async (user) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
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
        expiresIn: "1d",
      }
    );

    const url = `http://localhost:3000/user/confirmation/${emailToken}`;

    await transporter.sendMail({
      from: '"YaddaYaddaYadda" < ' + process.env.EMAIL_USERNAME + ">", // sender address
      to: user.email,
      subject: "Confirm Email",
      html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
    });
  } catch {
    throw "Error sending confirmation mail";
  }
};
