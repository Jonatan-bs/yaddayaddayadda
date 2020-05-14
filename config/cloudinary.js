const cloudinary = require("cloudinary").v2;
const path = require("path");
const Datauri = require("datauri");

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: "kuko",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// MOVE FILE FROM PUBLIC TO CLOUDINARY AND RETURN PUBLIC ID
module.exports.upload = async (req) => {
  const dUri = new Datauri();

  let file = dUri.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer
  );

  try {
    return await cloudinary.uploader.upload(file.content, {
      folder: `yadda/`,
    });
  } catch {
    return;
  }
};
