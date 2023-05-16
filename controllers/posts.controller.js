const PostService = require("../services/posts.service");

class PostController {
  postService = new PostService();

  //게시물 생성
  createPost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { content } = req.body;
      const { postPhoto } = req;

      if (!content) {
        throw new Error("412/모든 필드의 값은 필수 값 입니다.");
      }

      await this.postService.createPost(userId, content, postPhoto);
      return res.status(200).json({ message: "게시물을 생성하였습니다." });
    } catch (error) {
      error.failedApi = "게시물 생성";
      throw error;
    }
  };

  //게시물 수정
  putPost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;
      const { content } = req.body;

      const findOnePost = await this.postService.findOnePost(postId);
      if (!findOnePost) {
        throw new Error("412/게시글이 존재하지 않습니다.");
      }

      if (userId !== findOnePost.UserId) {
        throw new Error("414/게시글 수정의 권한이 존재하지 않습니다.");
      }

      await this.postService.putPost(postId, content);

      return res.status(200).json({ message: "게시물을 수정하였습니다." });
    } catch (error) {
      error.failedApi = "게시물 수정";
      throw error;
    }
  };

  //게시물 삭제
  deletePost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;

      const findOnePost = await this.postService.findOnePost(postId);
      if (!findOnePost) {
        throw new Error("412/게시글이 존재하지 않습니다.");
      }

      if (userId !== findOnePost.UserId) {
        throw new Error("414/게시글 삭제 권한이 존재하지 않습니다");
      }

      await this.postService.deletePost(postId);

      return res.status(200).json({ message: "게시물을 삭제하였습니다." });
    } catch (error) {
      error.failedApi = "게시물 삭제";
      throw error;
    }
  };

  //메인페이지
  main = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;

      const followedPosts = await this.postService.findAllFollowsPost(userId);

      res.status(200).json(followedPosts);
    } catch (error) {
      error.failedApi = "메인 페이지 조회";
      throw error;
    }
  };

  // 좋아요 수정
  putLike = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;

      const like = await this.postService.putLike(postId, userId);

      res.status(200).json({ message: like });
    } catch (error) {
      error.failedApi = "좋아요";
      throw error;
    }
  };
  //탐색페이지
  getRandomPosts = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;

      const randomPosts = await this.postService.getRandomPosts(userId);

      res.status(200).json(randomPosts);
    } catch (error) {
      error.failedApi = "게시물 조회";
      throw error;
    }
  };
}

module.exports = PostController;
