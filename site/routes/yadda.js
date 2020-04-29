const express = require("express");
const router = express.Router();
const yadda = require("../controllers/yaddaController.js");

router.post("/", yadda.create);

module.exports = router;
