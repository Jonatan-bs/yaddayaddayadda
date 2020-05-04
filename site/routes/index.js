const express = require("express");
const router = express.Router();
const index = require("../controllers/indexController.js");
const { ensureAuthenticated } = require("../config/auth");

router.get("/", ensureAuthenticated, index.frontpage);

router.get("/search/:type/:search", ensureAuthenticated, index.search);

router.post("/yadda", index.createYadda);

module.exports = router;
