const CommentService = require("../services/comments.service.js");
const { Posts } = require("../models");

// Comment의 컨트롤러(controller) 역할을 하는 클래스
class CommentController {
  commentService = new CommentService(); // Comment 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.

  // 메인 페이지 댓글 생성 & 게시물 상세 조회 댓글 생성
  createComment = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { comment } = req.body;
    try {
      const findOnePost = await this.commentService.findOnePost(postId); // service 계층에 구현된 createComment 로직을 실행합니다.
      if (!findOnePost) throw new Error("403/게시물이 존재하지 않습니다.");
      if (!comment) throw new Error("403/댓글 작성에 실패하였습니다.");

      const createcommentData = await this.commentService.createComment(
        userId,
        postId,
        comment,
      );

      res.status(201).json(createcommentData);
    } catch (error) {
      throw new Error(
        error.message || "400/요청한 데이터 형식이 올바르지 않습니다.",
      );
    }
  };

  // 게시물 상세 조회 들어가서 댓글 조회
  searchComment = async (req, res, next) => {
    const { postId } = req.params;
    try {
      const findOnePost = await this.commentService.findOnePost(postId); 

      // 게시물 유효성 검사
      if (!findOnePost) throw new Error("403/게시물이 존재하지 않습니다.");

      const findCommentsData = await this.commentService.findComments(postId);
      // 댓글 조회
      if (!findCommentsData) throw new Error("403/댓글이 존재하지 않습니다.");

      return res.status(200).json({ commentsData: findCommentsData });
    } catch (error) {
      throw new Error(
        error.message || "400/요청한 데이터 형식이 올바르지 않습니다.",
      );
    }
  };

  // 게시물 상세 조회 들어가서 댓글 삭제
  deleteComment = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { postId, commentId } = req.params;

    try {
      const findOnePost = await this.commentService.findOnePost(postId); 
      // 게시물 유효성 검사
      if (!findOnePost) throw new Error("403/게시물이 존재하지 않습니다.");

      const findOneComment = await this.commentService.findOneComment(commentId);
      // 댓글 하나 찾기
      if (!findOneComment) throw new Error("403/댓글이 존재하지 않습니다.");

      if (findOneComment.UserId !== userId)
        throw new Error("403/게시글 삭제 권한이 존재하지 않습니다.");

      const deleteCommentData = await this.commentService.deleteComment(
        userId,
        postId,
        commentId,
      );

      return res.status(200).json(deleteCommentData);
    } catch (error) {
      throw new Error(error.message || "400/댓글 작성에 실패하였습니다..");
    }
  };
}

module.exports = CommentController;
