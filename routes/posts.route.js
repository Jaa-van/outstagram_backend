const express = require("express");
const router = express.Router();

const uploadPostPhoto = require("../modules/s3_postPhoto.js");
const PostsController = require("../controllers/posts.controller");
const authMiddleware = require("../middlewares/auth-middleware");

const postsController = new PostsController();

// 메인 페이지
router.get("/main", authMiddleware, postsController.readMainPage);

// 랜덤 페이지
router.get("/random", authMiddleware, postsController.readRandomPage);

// 게시물 생성 시 유저 정보 조회
router.get("/", authMiddleware, postsController.readUserNicknameAndPhoto);

// 게시물 생성
router.post(
  "/",
  authMiddleware,
  uploadPostPhoto.single("postPhoto"),
  postsController.createPost,
);

//게시물 상세 페이지 조회
router.get("/:postId", authMiddleware, postsController.readPost);

// 게시물 수정
router.put("/:postId", authMiddleware, postsController.updatePost);

// 게시물 삭제
router.delete("/:postId", authMiddleware, postsController.deletePost);

// 좋아요
router.put("/:postId/like", authMiddleware, postsController.updateLike);

module.exports = router;
