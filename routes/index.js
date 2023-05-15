const express = require("express");
const router = express.Router();
const postsRouter = require("./posts.route.js");
const authRouter = require("./auth.route.js");
const commentsRouter = require("./comments.route.js");

router.use("/", [authRouter, postsRouter, commentsRouter]);

module.exports = router;
