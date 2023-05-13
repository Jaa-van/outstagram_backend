const express = require('express');
const router = express.Router();
const PostController = require('../controllers/posts.controller');
const postController = new PostController();
const authMiddleware = require('../middlewares/auth-middleware');

//#Controller? clients와 method로 소통하는 구간// 식당에서 홀 구역

// 게시물 생성
router.post('/main', authMiddleware, postController.createPost);  //왜 메인으로 하지?
// 게시물 수정
router.put('/posts/:postId', authMiddleware, postController.putPost);
// 게시물 삭제
router.delete('/posts/:postId', authMiddleware, postController.deletePost);

module.exports = router;
