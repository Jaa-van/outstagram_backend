const express = require("express");
const router = express.Router();

const uploadPostPhoto = require("../modules/s3_postPhoto.js");
const PostController = require("../controllers/posts.controller");
const authMiddleware = require("../middlewares/auth-middleware");

const postController = new PostController();

// 게시물 생성
router.post(
  "/posts",
  authMiddleware,
  uploadPostPhoto.single("postPhoto"),
  postController.createPost,
);

// 게시물 생성시 유저 정보 get
router.get("/posts", authMiddleware, postController.getUserData);

// 좋아요 수정
router.put("/posts/:postId/like", authMiddleware, postController.putLike);
// 게시물 수정
router.put("/posts/:postId", authMiddleware, postController.putPost);
// 게시물 삭제
router.delete("/posts/:postId", authMiddleware, postController.deletePost);
// 메인페이지
router.get("/main", authMiddleware, postController.main);
router.get("/postsrandom", authMiddleware, postController.getRandomPosts);

module.exports = router;
