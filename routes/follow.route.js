const express = require("express");
const router = express.Router();

const FollowController = require("../controllers/follow.controller");
const authMiddleware = require("../middlewares/auth-middleware");

const followController = new FollowController();

router.put("/users/:userId/follow", authMiddleware, followController.putFollow);

router.get("/users/:userId/follower", followController.getFollower);

module.exports = router;
