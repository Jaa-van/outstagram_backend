const express = require("express");
const router = express.Router();
const postsRouter = require("./posts.route.js");
const authRouter = require("./auth.route.js");

router.use("/", [authRouter, postsRouter]);

module.exports = router;
