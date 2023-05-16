const { Op } = require("sequelize");

class CommentRepository {
  constructor(commentsModel, postsModel, usersModel) {
    this.commentsModel = commentsModel;
    this.postsModel = postsModel;
    this.usersModel = usersModel;
  }

  // 메인 페이지 댓글 생성 & 게시물 상세 조회 댓글 생성
  createComment = async (userId, postId, comment) => {
    const createCommentData = await this.commentsModel.create({
      UserId: userId,
      PostId: postId,
      comment,
    });

    // 댓글 수(count)를 증가시킵니다.
    await this.postsModel.increment("commentsCount", { where: { postId } });

    return createCommentData;
  };

  // 게시물 조회 (with postId)
  findOnePost = async (postId) => {
    return await this.postsModel.findOne({ where: { postId } });
  };

  // 유저 한명 조회
  findOneUser = async (userId) => {
    return await this.usersModel.findOne({ where: { userId } });
  };

  // 댓글 전체 조회 (Comments model에서 with postId)
  findComments = async (postId) => {
    return await this.commentsModel.findAll({ where: { postId } });
  };

  // 댓글 하나 찾기 (with commentId)
  findOneComment = async (commentId) => {
    return await this.commentsModel.findOne({ where: { commentId } });
  };

  // 게시물 상세 조회 들어가서 댓글 삭제
  deleteComment = async (userId, postId, commentId) => {
    return await this.commentsModel.destroy({
      where: {
        [Op.and]: [{ UserId: userId }, { PostId: postId }, { commentId }],
      },
    });
  };
}

module.exports = CommentRepository;
