const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow.controller");
const followController = new FollowController();

module.exports = router;
