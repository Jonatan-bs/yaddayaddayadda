const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

module.exports = (user) => {
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.EMAIL_USERNAME, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });
    // Create jwt url and send mail
    await jwt.sign(
      {
        userId: user._id,
      },
      process.env.EMAIL_SECRET,
      {
        expiresIn: "1d",
      },
      (err, emailToken) => {
        const url = `http://localhost:3000/user/confirmation/${emailToken}`;

        transporter
          .sendMail({
            from: '"Jonatan Shoshan" <jonatan-bs@live.dk>', // sender address
            to: user.email,
            subject: "Confirm Email",
            html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
          })
          .then((res) => console.log("Confirmation mail sent"))
          .catch((err) => console.log("Error sending confirmation mail", err));
      }
    );
  }

  main().catch(console.error);
};
