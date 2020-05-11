const cloudinary = require("cloudinary").v2;
const path = require("path");
const Datauri = require("datauri");

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: "kuko",
  api_key: "992553735474166",
  api_secret: "W26ozdMILzrybdcBjYVi7kt7T3s",
});

// MOVE FILE FROM PUBLIC TO CLOUDINARY AND RETURN PUBLIC ID
module.exports.upload = async (req) => {
  const dUri = new Datauri();

  let file = dUri.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer
  );

  try {
    return await cloudinary.uploader.upload(
      file.content,
      {
        folder: `yadda/`,
        // categorization: "aws_rek_tagging",
        tags: ["temp"],
        // auto_tagging: 0.85,
      } // directory and tags are optional
    );
  } catch {
    return;
  }
};
