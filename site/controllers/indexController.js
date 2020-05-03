const Yadda = require("../models/Yadda");

exports.frontpage = async (req, res) => {
  const yaddas = await Yadda.find({});
  res.render("index", {
    title: "Frontpage",
    yaddas,
  });
};
