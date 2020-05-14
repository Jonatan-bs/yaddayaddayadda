const express = require("express");
const router = express.Router();
const index = require("../controllers/indexController.js");
const api = require("../controllers/apiController.js");
const { ensureAuthenticated } = require("../config/auth");
const upload = require("../config/multer");

router.get("/", index.frontpage);
router.get("/search/:type/:search", ensureAuthenticated, index.search);
router.get("/settings", ensureAuthenticated, index.settings);
router.get("/followers/:id", ensureAuthenticated, index.followers);
router.get("/following/:id", ensureAuthenticated, index.following);
router.get("/profile/:id", ensureAuthenticated, index.profile);
router.get("/thread/:id", ensureAuthenticated, index.thread);

router.post("/profilepic", ensureAuthenticated, upload, api.profilePic);
router.post("/name", ensureAuthenticated, api.name);
router.post("/password", ensureAuthenticated, api.password);
router.post("/follow/:id", ensureAuthenticated, api.follow);
router.post("/theme", ensureAuthenticated, api.theme);
router.post("/yadda", ensureAuthenticated, upload, api.createYadda);
router.post("/yadda/like", api.likeYadda);

module.exports = router;
