const express = require("express");
const router = express.Router();
const uploadPostPhoto = require("../modules/s3_postPhoto.js");
const PostController = require("../controllers/posts.controller");
const postController = new PostController();
const authMiddleware = require("../middlewares/auth-middleware");

// 게시물 생성
router.post(
  "/posts",
  authMiddleware,
  uploadPostPhoto.single("postPhoto"),
  postController.createPost,
);
// 게시물 수정
router.put("/posts/:postId", authMiddleware, postController.putPost);
// 게시물 삭제
router.delete("/posts/:postId", authMiddleware, postController.deletePost);
// 메인페이지
router.get("/main", authMiddleware, postController.main);

module.exports = router;
