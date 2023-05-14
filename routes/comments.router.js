const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comments.controller');
const commentController = new CommentController();
const authMiddleware = require('../middlewares/auth-middleware');


//#Controller? clients와 method로 소통하는 구간// 식당에서 홀 구역

// 메인 페이지 댓글 생성
router.post("/posts/:postId/comments", authMiddleware, commentController.createComment);

// 게시물 상세 조회 들어가서 댓글 조회
router.get("/posts/:postId/comments", authMiddleware, commentController.searchComment);



module.exports = router;