const mongoose = require("mongoose");

const Yadda = require("../models/Yadda");

exports.create = function (req, res) {
  const { text, images, parentID, sponsored, tags, likes } = req.body;

  // Create new yadda object
  const newYadda = new Yadda({
    text,
    images,
    parentID,
    sponsored,
    tags,
    likes,
  });

  //Save Yadda if mongoose Validation succeeds
  newYadda
    .save()
    .then(() => {
      res.status("201").json({ message: "Yadda was created" });
    })
    .catch((error) => res.status("500").json({ error: error.message }));
};
