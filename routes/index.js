const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route.js");

router.use("/", authRouter);

module.exports = router;
