const { Op } = require("sequelize");

class CommentsRepository {
  constructor(commentsModel) {
    this.commentsModel = commentsModel;
  }

  // 댓글 생성
  createComment = async (userId, postId, comment) => {
    const createdComment = await this.commentsModel.create({
      UserId: userId,
      PostId: postId,
      comment,
    });

    return createdComment;
  };

  // 게시물 아이디의 전체 댓글 조회
  findCommentsByPostId = async (postId) => {
    return await this.commentsModel.findAll({ where: { postId } });
  };

  // 댓글 아이디로 댓글 조회
  findCommentById = async (commentId) => {
    return await this.commentsModel.findOne({ where: { commentId } });
  };

  // 댓글 삭제
  deleteComment = async (userId, postId, commentId) => {
    return await this.commentsModel.destroy({
      where: {
        [Op.and]: [{ UserId: userId }, { PostId: postId }, { commentId }],
      },
    });
  };
}

module.exports = CommentsRepository;
