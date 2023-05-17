const CommentsService = require("../services/comments.service.js");
const PostsService = require("../services/posts.service.js");

class CommentsController {
  commentsService = new CommentsService();
  postsService = new PostsService();

  // 댓글 생성
  createComment = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;
      const { comment } = req.body;

      if (!comment) {
        throw new Error("403/댓글 작성에 실패하였습니다.");
      }

      const post = await this.postsService.findPostByPostId(postId);
      if (!post) {
        throw new Error("403/게시물이 존재하지 않습니다.");
      }

      await this.commentsService.createComment(userId, postId, comment);

      res.status(201).json({ message: "댓글을 작성하였습니다." });
    } catch (error) {
      error.failedApi = "댓글 작성";
      throw error;
    }
  };

  // 전체 댓글 조회
  readComments = async (req, res, next) => {
    try {
      const { postId } = req.params;

      const post = await this.postsService.findPostByPostId(postId);
      if (!post) {
        throw new Error("403/게시물이 존재하지 않습니다.");
      }

      const comments = await this.commentsService.findCommentsByPostId(postId);
      if (!comments) {
        throw new Error("403/댓글이 존재하지 않습니다.");
      }

      return res.status(200).json({ commentsData: comments });
    } catch (error) {
      error.faiedApi = "댓글 조회";
      throw error;
    }
  };

  // 댓글 삭제
  deleteComment = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId, commentId } = req.params;

      const post = await this.postsService.findPostByPostId(postId);
      if (!post) {
        throw new Error("403/게시물이 존재하지 않습니다.");
      }

      const comment = await this.commentsService.findCommentById(commentId);
      if (!comment) {
        throw new Error("403/댓글이 존재하지 않습니다.");
      }

      if (comment.UserId !== userId) {
        throw new Error("403/게시글 삭제 권한이 존재하지 않습니다.");
      }

      await this.commentsService.deleteComment(userId, postId, commentId);

      return res.status(200).json({ message: "댓글을 지웠습니다." });
    } catch (error) {
      error.faiedApi = "댓글 삭제";
      throw error;
    }
  };
}

module.exports = CommentsController;
