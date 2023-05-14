const express = require("express");
const router = express.Router();
const postsRouter = require("./posts.router");

app.use("./", postsRouter);

const authRouter = require("./auth.route.js");

router.use("/", authRouter);

module.exports = router;
