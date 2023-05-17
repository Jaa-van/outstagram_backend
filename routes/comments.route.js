const express = require("express");
const router = express.Router();

const CommentController = require("../controllers/comments.controller");
const authMiddleware = require("../middlewares/auth-middleware");

const commentController = new CommentController();

router.post(
  "/:postId/comments",
  authMiddleware,
  commentController.createComment,
);

router.get("/:postId/comments", authMiddleware, commentController.readComments);

router.delete(
  "/:postId/comments/:commentId",
  authMiddleware,
  commentController.deleteComment,
);

module.exports = router;
