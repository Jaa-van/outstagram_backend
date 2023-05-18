const CommentsRepository = require("../repositories/comments.repository.js");
const UsersRepository = require("../repositories/users.repository.js");

const { Comments, Users } = require("../models");

class CommentsService {
  commentsRepository = new CommentsRepository(Comments);
  usersRepository = new UsersRepository(Users);

  // 댓글 생성
  createComment = async (userId, postId, comment) => {
    return await this.commentsRepository.createComment(userId, postId, comment);
  };

  // 게시물 아이디의 전체 댓글 조회
  findCommentsByPostId = async (postId) => {
    const comments = await this.commentsRepository.findCommentsByPostId(postId);

    const commentsWithDetail = await Promise.all(
      comments.map(async (comment) => {
        const user = await this.usersRepository.findUserById(comment.UserId);

        return {
          commentId: comment.commentId,
          UserId: comment.UserId,
          PostId: comment.PostId,
          comment: comment.comment,
          nickname: user.nickname,
          userPhoto: user.userPhoto,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        };
      }),
    );

    return commentsWithDetail.sort((a, b) => b.createdAt - a.createdAt);
  };

  // 댓글 아이디로 댓글 조회
  findCommentById = async (commentId) => {
    return await this.commentsRepository.findCommentById(commentId);
  };

  // 댓글 삭제
  deleteComment = async (userId, postId, commentId) => {
    await this.commentsRepository.deleteComment(userId, postId, commentId);
  };
}

module.exports = CommentsService;
