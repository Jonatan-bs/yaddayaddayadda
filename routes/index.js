const express = require("express");
const router = express.Router();
const index = require("../controllers/indexController.js");
const { ensureAuthenticated } = require("../config/auth");
const upload = require("./../controllers/handlers/multer");

router.get("/", index.frontpage);

router.get("/search/:type/:search", ensureAuthenticated, index.search);
router.get("/settings", ensureAuthenticated, index.settings);
router.get("/followers/:id", ensureAuthenticated, index.followers);
router.get("/following/:id", ensureAuthenticated, index.following);
router.get("/profile/:id", ensureAuthenticated, index.profile);
router.get("/thread/:id", ensureAuthenticated, index.thread);

router.post("/profilepic", ensureAuthenticated, upload, index.profilePic);
router.post("/name", ensureAuthenticated, index.name);
router.post("/follow/:id", ensureAuthenticated, index.follow);
router.post("/theme", ensureAuthenticated, index.theme);
router.post("/yadda", ensureAuthenticated, upload, index.createYadda);
router.post("/yadda/like", index.likeYadda);

module.exports = router;
