const multer = require("multer"); // Handle file uploads

// MULTER MIDDLEWARE

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/gif" ||
    file.mimetype == "image/png"
  ) {
    // Accept file
    return callback(null, true);
  } else {
    // reject file
    return callback(null, false);
  }
};

const storage = multer.memoryStorage();
module.exports = multer({ storage, fileFilter }).single("image");
