const PostService = require("../services/posts.service");

class PostController {
  postService = new PostService();

  // 게시물 생성
  createPost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { content } = req.body;
      const { postPhoto } = req;

      if (!content) {
        throw new Error("412/모든 필드의 값은 필수 값 입니다.");
      }

      await this.postService.createPost(userId, content, postPhoto);

      res.status(200).json({ message: "게시물을 생성하였습니다." });
    } catch (error) {
      error.failedApi = "게시물 생성";
      throw error;
    }
  };

  // 게시물 수정
  updatePost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;
      const { content } = req.body;

      const post = await this.postService.findDetailedPost(postId);
      if (!post) {
        throw new Error("412/게시글이 존재하지 않습니다.");
      }

      if (userId !== post.UserId) {
        throw new Error("414/게시글 수정의 권한이 존재하지 않습니다.");
      }

      await this.postService.updatePost(postId, content);

      return res.status(200).json({ message: "게시물을 수정하였습니다." });
    } catch (error) {
      error.failedApi = "게시물 수정";
      throw error;
    }
  };

  // 게시물 삭제
  deletePost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;

      const post = await this.postService.findPostById(postId);
      if (!findOnePost) {
        throw new Error("412/게시글이 존재하지 않습니다.");
      }

      if (userId !== post.UserId) {
        throw new Error("414/게시글 삭제 권한이 존재하지 않습니다");
      }

      await this.postService.deletePost(postId);

      return res.status(200).json({ message: "게시물을 삭제하였습니다." });
    } catch (error) {
      error.failedApi = "게시물 삭제";
      throw error;
    }
  };

  // 메인페이지
  readMainPage = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;

      const followedPosts = await this.postService.findPostsOfFollowings(
        userId,
      );

      res.status(200).json(followedPosts);
    } catch (error) {
      error.failedApi = "메인 페이지 조회";
      throw error;
    }
  };

  // 탐색페이지
  readRandomPage = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;

      const randomPosts = await this.postService.findPostsByRandom(userId);

      res.status(200).json(randomPosts);
    } catch (error) {
      error.failedApi = "게시물 조회";
      throw error;
    }
  };

  // 게시물 상세페이지
  readPost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;

      const post = await this.postService.findDetailedPost(postId, userId);

      res.status(200).json(post);
    } catch (error) {
      error.failedApi = "상세페이지 조회";
      throw error;
    }
  };

  // 좋아요 수정
  updateLike = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;

      const like = await this.postService.updateLike(postId, userId);

      if (like) {
        res.status(200).json({ message: "게시글의 좋아요를 취소하였습니다." });
      } else {
        res.status(200).json({ message: "게시글의 좋아요를 등록하였습니다." });
      }
    } catch (error) {
      error.failedApi = "좋아요";
      throw error;
    }
  };

  readUserNicknameAndPhoto = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;

      const userData = await this.postService.findUserNicknameAndPhoto(userId);

      res.status(200).json(userData);
    } catch (error) {
      error.failedApi = "유저 조회";
      throw error;
    }
  };
}

module.exports = PostController;
