const express = require("express");
const router = express.Router();

const postsRouter = require("./posts.route.js");
const authRouter = require("./auth.route.js");
const commentsRouter = require("./comments.route.js");
const followsRouter = require("./follow.route.js");
const searchRouter = require("./search.route");

// /posts로 시작하는 url들을 처리하는 router
router.use("/posts", [postsRouter, commentsRouter]);
router.use("/auth", authRouter);
router.use("/users", followsRouter);

router.use("/", searchRouter);

module.exports = router;
