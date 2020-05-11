const express = require("express");
const router = express.Router();
const index = require("../controllers/indexController.js");
const { ensureAuthenticated } = require("../config/auth");
const imageCtrl = require("../controllers/image");
const multer = require("multer"); // Handle file uploads
const upload = require("./../controllers/handlers/multer");

router.get("/", index.frontpage);

router.get("/search/:type/:search", ensureAuthenticated, index.search);

router.post("/yadda", ensureAuthenticated, upload, index.createYadda);
router.post("/yadda/like", index.likeYadda);

module.exports = router;
