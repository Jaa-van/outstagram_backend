const express = require("express");
const router = express.Router();

const postsRouter = require("./posts.route.js");
const authRouter = require("./auth.route.js");
const commentsRouter = require("./comments.route.js");
const followRouter = require("./follow.route");
const searchRouter = require("./search.route");

router.use("/", [authRouter, postsRouter, commentsRouter, followRouter, searchRouter]);

module.exports = router;
