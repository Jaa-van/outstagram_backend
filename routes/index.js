const express = require("express");
const router = express.Router();

const postsRouter = require("./posts.route.js");
const authRouter = require("./auth.route.js");
const commentsRouter = require("./comments.route.js");
const followsRouter = require("./follow.route.js");
const searchRouter = require("./search.route");

router.use("/posts", [postsRouter, commentsRouter]);

router.use("/auth", authRouter);

router.use("/users", followsRouter);

router.use("/search", searchRouter);

module.exports = router;
