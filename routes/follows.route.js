const express = require("express");
const router = express.Router();

const FollowsController = require("../controllers/follows.controller");
const authMiddleware = require("../middlewares/auth-middleware");

const followsController = new FollowsController();

router.get("/:userId", authMiddleware, followsController.readPageByUserId);

router.put("/:userId/follow", authMiddleware, followsController.updateFollow);

router.get("/:userId/follower", followsController.readFollowings);

router.get("/:userId/follow", followsController.readFollowers);

module.exports = router;
